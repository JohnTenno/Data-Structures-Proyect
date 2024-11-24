import { TestBed } from '@angular/core/testing';

import { TrieService } from './trie.service';

describe('TrieService', () => {
  let service: TrieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
