import { TestBed } from '@angular/core/testing';

import { DbStudykitServiceService } from './db-studykit-service.service';

describe('DbStudykitServiceService', () => {
  let service: DbStudykitServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbStudykitServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
