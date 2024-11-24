import { TestBed } from '@angular/core/testing';

import { HeapService } from './heap.service';

describe('HeapService', () => {
  let service: HeapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
