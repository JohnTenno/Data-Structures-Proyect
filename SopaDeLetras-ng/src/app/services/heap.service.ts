import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeapService {
  private heap: { word: string; score: number }[] = [];

  insert(word: string, score: number): void {
    this.heap.push({ word, score });
    this.heapifyUp();
  }

  extractMax(): { word: string; score: number } | null {
    if (this.heap.length === 0) return null;
    const max = this.heap[0];
    const end = this.heap.pop();

    if (this.heap.length > 0 && end) {
      this.heap[0] = end;
      this.heapifyDown();
    }

    return max;
  }

  private heapifyUp(): void {
    let index = this.heap.length - 1;
    const element = this.heap[index];

    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];

      if (parent.score >= element.score) break;

      this.heap[index] = parent;
      this.heap[parentIndex] = element;
      index = parentIndex;
    }
  }

  private heapifyDown(): void {
    let index = 0;
    const length = this.heap.length;
    const element = this.heap[0];

    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let largest = index;

      if (leftChildIndex < length && this.heap[leftChildIndex].score > this.heap[largest].score) {
        largest = leftChildIndex;
      }

      if (rightChildIndex < length && this.heap[rightChildIndex].score > this.heap[largest].score) {
        largest = rightChildIndex;
      }

      if (largest === index) break;

      this.heap[index] = this.heap[largest];
      this.heap[largest] = element;
      index = largest;
    }
  }
}
