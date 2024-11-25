import { Injectable } from "@angular/core";
import { TrieService } from "./trie.service";
import { DataService } from "./data.service";

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private board: string[][] = [];
  private attemptsLeft = 3;
  private timeLimit = 10;
  private score = 0;
  private timer: any;
  private wordsInGame: { word: string; definition: string; positions?: { row: number; col: number }[] }[] = [];
  private playerName: string = '';

  constructor(private trieService: TrieService, private dataService: DataService) { }


  stopGameTimer(): void {
    clearInterval(this.timer);
  }

  decreaseAttempts(): void {
    this.attemptsLeft -= 1;
  }

  increaseScore(points: number): void {
    this.score += points;
  }

  isGameOver(): boolean {
    return this.attemptsLeft <= 0 || this.timeLimit <= 0 || this.wordsInGame.length === 0;
  }

  getScore(): number {
    return this.score;
  }

  getPlayerName(): string {
    return this.playerName;
  }

  getAttemptsLeft(): number {
    return this.attemptsLeft;
  }

  getTimeLeft(): number {
    return this.timeLimit;
  }

  initializeGame(boardSize: { col: number, row: number }, playerName: string): void {
    this.attemptsLeft = 3;
    this.score = 0;
    const words = this.dataService.getWords();
    this.playerName = playerName;

    this.wordsInGame = this.selectRandomWords(words, boardSize.row);
    console.log('Palabras seleccionadas:', this.wordsInGame);

    for (const { word } of this.wordsInGame) {
      console.log(`Insertando palabra en Trie: ${word.toUpperCase()}`);
      this.trieService.insert(word.toUpperCase());
    }

    this.generateBoard(boardSize);
  }

  private selectRandomWords(words: { word: string; definition: string }[], boardSize: number) {
    const filteredWords = words.filter(word => word.word.length <= boardSize);
    const shuffled = filteredWords.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.floor(boardSize / 2));
  }

  private generateBoard(boardSize: { col: number, row: number }): void {
    console.log(`Generando tablero de tamaño ${boardSize.col}x${boardSize.row}`);
    this.board = Array.from({ length: boardSize.col }, () =>
      Array.from({ length: boardSize.row }, () => ' ')
    );
    for (const { word } of this.wordsInGame) {
      this.placeWordInBoard(word.toUpperCase());
    }
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === ' ') {
          this.board[i][j] =  String.fromCharCode(65 + Math.floor(Math.random() * 26)); 
          this.board[i][j] = " ";
        }
      }
    }
  }

  private placeWordInBoard(word: string): boolean {
    let placed = false;
  
    for (let attempt = 0; attempt < 200; attempt++) {
      const directions = ['horizontal', 'vertical', 'diagonal'];
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * this.board.length);
      const col = Math.floor(Math.random() * this.board.length);
  
      if (this.checkWordFit(word, row, col, direction)) {
        console.log(`Palabra ${word} colocada en [${row}, ${col}]`);
        this.insertWord(word, row, col, direction);
        placed = true;
        break;
      }
    }
  
    if (!placed) {
      console.log(`No se pudo colocar la palabra ${word} después de 200 intentos.`);
      this.wordsInGame = this.wordsInGame.filter(w => w.word.toUpperCase() !== word.toUpperCase());
    }
  
    return placed;
  }
  


  private checkWordFit(word: string, row: number, col: number, direction: string): boolean {
    for (let i = 0; i < word.length; i++) {
      const r = row + (direction === 'vertical' ? i : direction === 'diagonal' ? i : 0);
      const c = col + (direction === 'horizontal' ? i : direction === 'diagonal' ? i : 0);
      if (r >= this.board.length || c >= this.board.length || this.board[r][c] !== ' ') {
        return false;
      }
    }
    return true;
  }

  private insertWord(word: string, row: number, col: number, direction: string): void {
    const positions: { row: number; col: number }[] = []; 

    for (let i = 0; i < word.length; i++) {
      const r = row + (direction === 'vertical' ? i : direction === 'diagonal' ? i : 0);
      const c = col + (direction === 'horizontal' ? i : direction === 'diagonal' ? i : 0);
      this.board[r][c] = word[i];
      positions.push({ row: r, col: c });
    }

    const wordIndex = this.wordsInGame.findIndex(w => w.word.toUpperCase() === word);
    if (wordIndex !== -1) {
      this.wordsInGame[wordIndex].positions = positions;
    }
  }

  validateWordFromBoard(selectedWord: string, selectedPositions: { row: number; col: number }[]): boolean {
    console.log(`Validando palabra seleccionada: ${selectedWord}`);

    if (!this.trieService.search(selectedWord.toUpperCase())) {
      console.log('La palabra no existe en el conjunto de palabras válidas.');
      return false;
    }

    const wordEntry = this.wordsInGame.find(w => w.word.toUpperCase() === selectedWord.toUpperCase());
    if (!wordEntry || !wordEntry.positions) {
      console.log('La palabra no está en el juego o no tiene posiciones registradas.');
      return false;
    }

    const matches = wordEntry.positions.every(pos =>
      selectedPositions.some(sel => sel.row === pos.row && sel.col === pos.col)
    );

    if (matches) {
      console.log('¡Palabra válida y las posiciones coinciden!');
      this.trieService.delete(selectedWord.toUpperCase());
      console.log(`Palabra eliminada del Trie: ${selectedWord.toUpperCase()}`);
      return true;
    } else {
      console.log('Las posiciones seleccionadas no coinciden con la palabra en el tablero.');
      return false;
    }
  }

  getWordCells(word: string): { row: number; col: number }[] {
    const wordEntry = this.wordsInGame.find(w => w.word.toUpperCase() === word.toUpperCase());
    return wordEntry?.positions || [];
  }

  getBoard(): string[][] {
    return this.board;
  }

  getWordsInGame(): { word: string; definition: string }[] {
    return this.wordsInGame;
  }
}
