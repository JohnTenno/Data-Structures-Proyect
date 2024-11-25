import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { GameService } from '../services/game.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    CardModule,
    DialogModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  fileLoaded = false;
  dificultySelected = false;
  playerName: string = '';
  showDialogFile = false;
  difficultySelected = false;

  levels = {
    easy: 'easy',
    medium: 'medium',
    hard: 'hard'
  }
  difficulty: string = this.levels.easy;
  difficultyOptions = [
    { label: 'Fácil (10x10)', value: this.levels.easy },
    { label: 'Medio (10x20)', value: this.levels.medium },
    { label: 'Difícil (20x20)', value: this.levels.hard }
  ];


  constructor(
    private dataService: DataService,
    private gameService: GameService,
    private router: Router) { }


  ngOnInit(): void {
    this.dataService.isFileLoaded() ? this.fileLoaded = true : this.fileLoaded = false;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      console.log('Archivo cargado:', input.files[0]);
      this.dataService.loadExcel(input.files[0]);
      this.fileLoaded = true;
    }
  }

  selectDifficulty(difficulty: string): void {
    this.difficulty = difficulty;
    this.dificultySelected = true;
  }

  onSubmit(): void {
    this.startGame();
  }

  startGame(): void {
    console.log(this.difficulty)
    let boardSize = { row: 10, col: 10 };
    if (this.difficulty === 'easy') {
      boardSize = { ...boardSize, col: 10, row: 10 };
    } else if (this.difficulty === 'medium') {
      boardSize = { ...boardSize, col: 10, row: 20 };
    } else if (this.difficulty === 'hard') {
      boardSize = { ...boardSize, col: 20, row: 20 };
    }
    this.gameService.initializeGame(boardSize, this.playerName);
    this.router.navigate(['/game']);
  }
}