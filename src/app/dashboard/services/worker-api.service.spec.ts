import { TestBed } from '@angular/core/testing';

import { WorkerApiService } from './worker-api.service';

describe('WorkerApiService', () => {
  let service: WorkerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkerApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
