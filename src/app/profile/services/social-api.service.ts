import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import {environment} from '../../../environments/environment';
import {CreateSocialDto, SocialSummary} from '../models/social.entity';

@Injectable({ providedIn: 'root' })
export class SocialsApiService {

  private base = `${environment.serverBaseUrl}/providerProfiles`;

  constructor(private http: HttpClient) {}

  /** POST /providerProfiles/{profileId}/socials */
  create(profileId: number, body: CreateSocialDto): Observable<SocialSummary> {
    return this.http.post<SocialSummary>(`${this.base}/${profileId}/socials`, body);
  }

  /** PUT  /providerProfiles/{profileId}/socials/{id} */
  update(profileId: number, id: number, body: CreateSocialDto): Observable<SocialSummary> {
    return this.http.put<SocialSummary>(`${this.base}/${profileId}/socials/${id}`, body);
  }

  /** DELETE /providerProfiles/{profileId}/socials/{id} */
  delete(profileId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${profileId}/socials/${id}`);
  }
}
