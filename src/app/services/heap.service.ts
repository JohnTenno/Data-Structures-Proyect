import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Hace que este servicio sea un singleton gestionado por Angular.
})
export class HeapService<T> {
  private heap: { score: number; player: T }[] = [];

  // Inserta un jugador y su puntuación en el heap
  insert(player: T, score: number): void {
    this.heap.push({ score, player });
    this.bubbleUp();
  }

  // Extrae el elemento con la puntuación más alta del heap
  extractMax(): { score: number; player: T } | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop()!;

    const max = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown();
    return max;
  }

  // Devuelve todos los elementos del heap ordenados por puntuación descendente
  getAll(): { score: number; player: T }[] {
    return [...this.heap].sort((a, b) => b.score - a.score);
  }

  // Operaciones privadas para mantener el heap en orden

  private bubbleUp(): void {
    let index = this.heap.length - 1;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index].score <= this.heap[parentIndex].score) break;

      [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
      index = parentIndex;
    }
  }

  private bubbleDown(): void {
    let index = 0;
    const length = this.heap.length;

    while (true) {
      const leftIndex = 2 * index + 1;
      const rightIndex = 2 * index + 2;
      let largest = index;

      if (leftIndex < length && this.heap[leftIndex].score > this.heap[largest].score) {
        largest = leftIndex;
      }
      if (rightIndex < length && this.heap[rightIndex].score > this.heap[largest].score) {
        largest = rightIndex;
      }

      if (largest === index) break;

      [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
      index = largest;
    }
  }
}
