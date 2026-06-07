import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PortfolioApiService {
  // camelCase to match the backend PortfolioImagesController (/providerProfiles/{id}/portfolio).
  private baseUrl = `${environment.serverBaseUrl}/providerProfiles`;

  constructor(private http: HttpClient) {}

  updatePortfolioImage(providerProfileId: number, imageId: number, data: { imageUrl: string }) {
    const url = `${this.baseUrl}/${providerProfileId}/portfolio/${imageId}`;
    return this.http.put(url, data);
  }
}
