import { TestBed } from '@angular/core/testing';

import { DbStudykitService } from './db-studykit.service';

describe('DbStudykitService', () => {
  let service: DbStudykitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbStudykitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
