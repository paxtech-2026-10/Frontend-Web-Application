import { Injectable } from '@angular/core';
import {BaseService} from '../../shared/services/base.service';
import {PortfolioImageResponse} from './portfolio-image.response';
import {catchError, Observable, retry} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioImageApiService extends BaseService<PortfolioImageResponse>{
  override resourceEndpoint = '/providerProfiles';
  constructor() {
    super();
  }

  createPortfolioImage(providerProfileId: number, imageUrl: string): Observable<PortfolioImageResponse> {
    const endpoint = `${this.resourcePath()}/${providerProfileId}/portfolio`;
    const body = { imageUrl };
    return this.http.post<PortfolioImageResponse>(endpoint, body, this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }

}
