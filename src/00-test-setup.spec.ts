import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

const defaultActivatedRoute = {
  snapshot: {
    paramMap: convertToParamMap({ id: '1' }),
    queryParamMap: convertToParamMap({})
  },
  paramMap: of(convertToParamMap({ id: '1' })),
  queryParamMap: of(convertToParamMap({}))
};

const originalConfigureTestingModule = TestBed.configureTestingModule.bind(TestBed);

TestBed.configureTestingModule = ((moduleDef: any = {}) => {
  return originalConfigureTestingModule({
    ...moduleDef,
    imports: [
      TranslateModule.forRoot(),
      ...(moduleDef.imports ?? [])
    ],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
      { provide: ActivatedRoute, useValue: defaultActivatedRoute },
      ...(moduleDef.providers ?? [])
    ]
  });
}) as typeof TestBed.configureTestingModule;
