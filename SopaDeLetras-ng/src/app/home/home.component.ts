import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { GameService } from '../services/game.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  fileLoaded = false;

  levels = {
    easy: 'easy',
    medium: 'medium',
    hard: 'hard'
  }
  difficulty: string = this.levels.easy;

  constructor(
    private dataService: DataService,
    private gameService: GameService,
    private router: Router) { }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.dataService.loadExcel(file).then(() => {
        this.fileLoaded = true;
      }).catch(error => {
        alert('Error al cargar el archivo: ' + error.message);
      });
    }
  }

  startGame(): void {
    let boardSize = { row: 10, col: 10 };
    if (this.difficulty === 'easy') {
      boardSize = { ...boardSize, col: 10, row: 10 };
    } else if (this.difficulty === 'medium') {
      boardSize = { ...boardSize, col: 10, row: 20 };
    } else if (this.difficulty === 'hard') {
      boardSize = { ...boardSize, col: 20, row: 20 };
    }
    this.gameService.initializeGame(boardSize);
    this.router.navigate(['/game']);
  }
}