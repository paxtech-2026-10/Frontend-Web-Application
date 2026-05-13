import { TestBed } from '@angular/core/testing';

import { BaseService } from './base.service';

class TestBaseService extends BaseService<any> {}

describe('BaseService', () => {
  let service: BaseService<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestBaseService]
    });
    service = TestBed.inject(TestBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
