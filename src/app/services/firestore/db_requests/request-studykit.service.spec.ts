import { TestBed } from '@angular/core/testing';

import { RequestStudykitService } from './request-studykit.service';

describe('RequestStudykitService', () => {
  let service: RequestStudykitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestStudykitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
