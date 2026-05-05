import { TestBed } from '@angular/core/testing';

import { ServiceApiService } from './services-api.service';

describe('ServicesApiService', () => {
  let service: ServiceApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
