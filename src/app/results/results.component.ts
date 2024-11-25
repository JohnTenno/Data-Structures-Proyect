import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { GameService } from '../services/game.service';
import { TrieService } from '../services/trie.service';
import { HeapService } from '../services/heap.service';
import { MaxHeap } from '../utils/max-heap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, DialogModule, CardModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent implements OnInit{
  scores: any;
  scoresDialogVisible: boolean = false;

  constructor(private heapService: HeapService<string>, private route: Router) { }

  ngOnInit(): void {
      this.showScoresDialog();
  }
  showScoresDialog(): void {
    this.loadScores();
    this.scoresDialogVisible = true;
  }

  loadScores(): void {
    this.scores = this.heapService.getAll();
    if(this.scores.length === 0) 
      this.route.navigate(['home']);
    console.log(this.scores)
  }
  
}
