import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { ResultsComponent } from './results/results.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Ruta inicial
  { path: 'home', component: HomeComponent },
  { path: 'game', component: GameComponent },
  { path: 'ranking', component: ResultsComponent },
];
