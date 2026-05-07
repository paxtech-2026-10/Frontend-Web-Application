import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

import { WorkerApiService } from './worker-api.service';
import { WorkerResource } from './worker.resource';

describe('WorkerApiService', () => {
  let service: WorkerApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(WorkerApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch workers from api and map response', () => {
    const response: WorkerResource[] = [
      {
        id: 1,
        name: 'Andrea',
        specialization: 'Nails',
        photoUrl: 'https://example.com/a.jpg',
        providerId: 3
      }
    ];

    service.getWorkers().subscribe((workers) => {
      expect(workers).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.serverBaseUrl}/workers`);
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });
});
