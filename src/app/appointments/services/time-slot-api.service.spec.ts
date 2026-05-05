import { TestBed } from '@angular/core/testing';

import { TimeSlotApiService } from './time-slot-api.service';

describe('TimeSlotApiService', () => {
  let service: TimeSlotApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeSlotApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
