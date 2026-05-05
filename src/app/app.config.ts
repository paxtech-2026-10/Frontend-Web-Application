import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideRouter } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import {authInterceptor} from './iam/services/auth.interceptor'; // 👈 Asegúrate de que la ruta esté correcta

const httpLoaderFactory = (http: HttpClient): TranslateLoader =>
  new TranslateHttpLoader(http, './i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor])), // 👈 Aquí se registra el interceptor
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en',
    }),
    provideRouter(routes)
  ]
};
