import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class TrieService {
  private root: any = {};

  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node[char]) {
        node[char] = {};
      }
      node = node[char];
    }
    node.isEndOfWord = true;
  }

  search(word: string): boolean {
    let node = this.root;
    for (const char of word) {
      if (!node[char]) {
        return false;
      }
      node = node[char];
    }
    return !!node.isEndOfWord;
  }

  delete(word: string): void {
    const deleteHelper = (node: any, word: string, depth: number): boolean => {
      if (depth === word.length) {
        if (!node.isEndOfWord) return false;
        node.isEndOfWord = false;
        return Object.keys(node).length === 0;
      }

      const char = word[depth];
      if (!node[char]) return false;

      const shouldDeleteChild = deleteHelper(node[char], word, depth + 1);

      if (shouldDeleteChild) {
        delete node[char];
        return Object.keys(node).length === 0;
      }

      return false;
    };

    deleteHelper(this.root, word, 0);
  }
}
