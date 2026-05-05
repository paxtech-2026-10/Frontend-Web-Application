import { TestBed } from '@angular/core/testing';

import { SalonProfileApiService } from './salon-profile-api.service';

describe('SalonProfileApiService', () => {
  let service: SalonProfileApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalonProfileApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
