import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  words: { word: string; definition: string }[] = [];
  fileLoaded: boolean = false;
  constructor() { }

  loadExcel(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });

          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
          this.words = jsonData.map((row) => {
            const keys = Object.keys(row); 
            return {
              word: row[keys[0]], 
              definition: row[keys[1]],
            };
          });
          this.fileLoaded = true;
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }

  isFileLoaded(): boolean {
    return this.fileLoaded;
  }
  getWords(): { word: string; definition: string }[] {
    return this.words;
  }
}
