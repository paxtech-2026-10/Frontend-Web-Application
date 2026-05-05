import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PortfolioApiService {
  private baseUrl = '/api/v1/providerProfiles';

  constructor(private http: HttpClient) {}

  updatePortfolioImage(providerProfileId: number, imageId: number, data: { imageUrl: string }) {
    const url = `${this.baseUrl}/${providerProfileId}/portfolio/${imageId}`;
    return this.http.put(url, data);
  }
}
