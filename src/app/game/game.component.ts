import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../services/game.service';
import { MaxHeap } from '../utils/max-heap';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { HeapService } from '../services/heap.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, CardModule, DialogModule, FormsModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  board: string[][] = [];
  selectedCells: { row: number; col: number }[] = [];
  foundWords: string[] = [];
  isGameActive: boolean = true;
  endGameMessage: string = '';
  playerName: string = '';
  selectedWord: string = '';
  endGameDialog: boolean = false;
  showInstructionsDialog: boolean = true;
  wordsInGame: { word: string; definition: string; positions?: { row: number; col: number }[] }[] = [];

  timeLeft: number = 300;
  timer: any;

  constructor(
    private gameService: GameService,
    private router: Router,
    private heapService: HeapService<string>
  ) { }

  ngOnInit(): void {
    this.playerName = this.gameService.getPlayerName();
    this.playerName ? this.showInstructions() : this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  showInstructions(): void {
    this.showInstructionsDialog = true;
  }

  startNewGame(): void {
    this.showInstructionsDialog = false;
    this.board = this.gameService.getBoard();
    this.wordsInGame = this.gameService.getWordsInGame();
    this.startTimer();
    console.log(this.wordsInGame);
    this.foundWords = [];
    this.isGameActive = true;
  }

  startNewGamePlus(): void {
    this.router.navigate(['/home'])
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.endGame('Tiempo agotado');
      }
    }, 1000);
  }

  lifesLeft(): number {
    return this.gameService.getAttemptsLeft();
  }

  endGame(reason: string): void {
    clearInterval(this.timer);
    this.isGameActive = false;
    this.endGameMessage = reason;
    this.endGameDialog = true;
    this.heapService.insert(this.gameService.getPlayerName(), this.gameService.getScore());
    console.log(this.heapService);
    console.log(this.heapService.getAll(), "get all");
  }

  viewTable(): void {
    this.router.navigate(['/ranking']);
  }

  isSelected(row: number, col: number): boolean {
    return (
      this.selectedCells.some(cell => cell.row === row && cell.col === col) ||
      this.isPartOfFoundWord(row, col)
    );
  }

  isPartOfFoundWord(row: number, col: number): boolean {
    return this.foundWords.some(word => {
      const wordCells = this.gameService.getWordCells(word);
      return wordCells.some(cell => cell.row === row && cell.col === col);
    });
  }

  selectCell(row: number, col: number): void {
    if (this.isSelected(row, col)) {
      console.log(`Celda en [${row}, ${col}] ya está seleccionada.`);
      return;
    }

    this.selectedWord += this.board[row][col];
    this.selectedCells.push({ row, col });
    console.log('Celdas seleccionadas:', this.selectedCells);
    console.log('Palabra seleccionada hasta ahora:', this.selectedWord);
  }


  validateWord(): void {
    const selectedWord = this.selectedCells
      .map(({ row, col }) => this.board[row][col])
      .join('');

    console.log('Palabra seleccionada:', selectedWord);

    if (this.foundWords.includes(selectedWord)) {
      console.log('Palabra ya encontrada:', selectedWord);
      return;
    }

    const isValid = this.gameService.validateWordFromBoard(selectedWord, this.selectedCells);
    if (isValid) {
      const score = selectedWord.length * 5;
      this.gameService.increaseScore(score);
      console.log('¡Palabra válida!', selectedWord);
      this.foundWords.push(selectedWord);
      if (this.foundWords.length === this.wordsInGame.length) {
        this.endGame('¡Ganaste!');
        return;
      }
    } else {
      this.gameService.decreaseAttempts();
      if(this.gameService.getAttemptsLeft() === 0) {
        this.endGame('Agotaste tus oportunidades');
      }
      console.log('Palabra no válida.');
    }

    this.resetSelection();
  }

  addFoundWord(word: string): void {
    if (!this.foundWords.includes(word)) {
      this.foundWords.push(word);
    }
  }

  resetSelection(): void {
    this.selectedWord = '';
    this.selectedCells = [];
    console.log('Selección reiniciada.');
  }
}