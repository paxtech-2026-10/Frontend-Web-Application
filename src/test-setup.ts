import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [
      TranslateModule.forRoot()
    ],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: convertToParamMap({ id: '1' })
          },
          paramMap: []
        }
      }
    ]
  });
});
