import { TestBed } from '@angular/core/testing';

import { SalonApiService } from './salon-api.service';

describe('SalonApiService', () => {
  let service: SalonApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalonApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
