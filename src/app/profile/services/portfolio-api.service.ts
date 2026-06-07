import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PortfolioApiService {
  private baseUrl = `${environment.serverBaseUrl}/provider-profiles`;

  constructor(private http: HttpClient) {}

  updatePortfolioImage(providerProfileId: number, imageId: number, data: { imageUrl: string }) {
    const url = `${this.baseUrl}/${providerProfileId}/portfolio/${imageId}`;
    return this.http.put(url, data);
  }
}
