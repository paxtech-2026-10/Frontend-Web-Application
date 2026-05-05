import { TestBed } from '@angular/core/testing';

import { ProfileClientService } from './profile-api.service';

describe('ProfileApiService', () => {
  let service: ProfileClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
