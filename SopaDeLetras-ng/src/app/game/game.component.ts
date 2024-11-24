import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  board: string[][] = [];
  selectedCells: { row: number; col: number }[] = [];
  foundWords: string[] = [];
  currentWord: string = '';

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.board = this.gameService.getBoard();
  }

  selectCell(row: number, col: number): void {
    this.selectedCells.push({ row, col });
    this.currentWord += this.board[row][col];
  }

  validateWord(): void {
    if (this.gameService.validateWordFromBoard(this.currentWord, this.selectedCells)) {
      this.foundWords.push(this.currentWord);
      alert('¡Palabra encontrada!');
    } else {
      alert('No es una palabra válida.');
    }
    this.resetSelection();
  }

  resetSelection(): void {
    this.selectedCells = [];
    this.currentWord = '';
  }

  isSelected(row: number, col: number): boolean {
    return this.selectedCells.some(cell => cell.row === row && cell.col === col);
  }
}
