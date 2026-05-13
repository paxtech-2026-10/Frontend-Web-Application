import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

const defaultActivatedRoute = {
  snapshot: {
    paramMap: convertToParamMap({ id: '1' }),
    queryParamMap: convertToParamMap({})
  },
  params: of({ id: '1' }),
  queryParams: of({}),
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
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: MatDialogRef, useValue: { close: () => undefined, afterClosed: () => of(null) } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: MatSnackBar, useValue: { open: () => undefined } },
        ...(moduleDef.providers ?? [])
      ]
    });
}) as typeof TestBed.configureTestingModule;
