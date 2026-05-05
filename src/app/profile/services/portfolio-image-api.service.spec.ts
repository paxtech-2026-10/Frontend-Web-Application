import { TestBed } from '@angular/core/testing';

import { PortfolioImageApiService } from './portfolio-image-api.service';

describe('PortfolioImageApiService', () => {
  let service: PortfolioImageApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioImageApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
