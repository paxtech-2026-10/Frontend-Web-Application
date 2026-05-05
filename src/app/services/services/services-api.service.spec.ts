import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ServiceApiService } from './services-api.service';
import { ServiceResponse } from './service.response';
import { environment } from '../../../environments/environment';

describe('ServiceApiService', () => {
  let service: ServiceApiService;
  let httpMock: HttpTestingController;

  const expectedUrl = `${environment.serverBaseUrl}/services`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ServiceApiService
      ]
    });
    service = TestBed.inject(ServiceApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getServices', () => {
    it('issues a GET to the /services endpoint and maps the response through the assembler', () => {
      // Arrange
      const payload: ServiceResponse[] = [
        { id: 1, name: 'Haircut', duration: 30, price: 50, providerId: 1 },
        { id: 2, name: 'Manicure', duration: 45, price: 70, providerId: 2 }
      ];

      // Act
      let received: any[] = [];
      service.getServices().subscribe(services => (received = services));

      const req = httpMock.expectOne(expectedUrl);
      req.flush(payload);

      // Assert
      expect(req.request.method).toBe('GET');
      expect(received.length).toBe(2);
      expect(received[0].id).toBe(1);
      expect(received[0].name).toBe('Haircut');
      expect(received[1].providerId).toBe(2);
    });

    it('returns an empty array when the backend responds with an empty list', () => {
      // Arrange
      let received: any[] | undefined;

      // Act
      service.getServices().subscribe(services => (received = services));
      httpMock.expectOne(expectedUrl).flush([]);

      // Assert
      expect(received).toEqual([]);
    });

    it('emits a generic error after retrying twice when the backend keeps failing', () => {
      // Arrange
      // BaseService.getAll() pipes retry(2) before catchError(handleError), which means a single
      // failure triggers two retries. Three error responses must be flushed in total, and the
      // final error must be the generic "Something bad happened" wrapper.
      let capturedError: Error | undefined;

      // Act
      service.getServices().subscribe({
        next: () => fail('expected an error, got a value'),
        error: err => (capturedError = err)
      });

      for (let attempt = 0; attempt < 3; attempt++) {
        httpMock.expectOne(expectedUrl).flush(null, {
          status: 500,
          statusText: 'Internal Server Error'
        });
      }

      // Assert
      expect(capturedError).toBeDefined();
      expect(capturedError!.message).toContain('Something bad happened');
    });
  });
});
