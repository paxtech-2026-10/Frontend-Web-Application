import { TestBed } from '@angular/core/testing';

import { SocialApiService } from './social-api.service';

describe('SocialApiService', () => {
  let service: SocialApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
