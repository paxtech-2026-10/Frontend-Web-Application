import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { ProfileSalonResponse } from './profile-salon.response';
import { SalonProfile } from '../models/salon-profile.entity';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { SalonProfileAssembler } from './salon-profile.assembler';
import {UpdateImagesDto} from '../models/profile.entity';

@Injectable({
  providedIn: 'root'
})
export class SalonProfileApiService extends BaseService<ProfileSalonResponse> {
  override resourceEndpoint = '/provider-profiles';

  constructor() {
    super();
  }

  public getProfileById(id: number): Observable<SalonProfile> {
    return this.http.get<ProfileSalonResponse>(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError),
        map(response => SalonProfileAssembler.toEntityFromResponse(response))
      );
  }

  public getProfileByProviderId(providerId: number): Observable<SalonProfile> {
    return this.http.get<ProfileSalonResponse>(`${this.resourcePath()}/provider/${providerId}`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError),
        map(response => SalonProfileAssembler.toEntityFromResponse(response))
      );
  }

  public getActiveProviderProfile(): Observable<SalonProfile> {
    const providerId = Number(localStorage.getItem('providerId'));
    if (!providerId) {
      return throwError(() => new Error('No active provider session found.'));
    }
    return this.getProfileByProviderId(providerId);
  }

  public updateProfile(profileId: number, body: Partial<ProfileSalonResponse>): Observable<SalonProfile> {
    return this.http.put<ProfileSalonResponse>(`${this.resourcePath()}/${profileId}`, body, this.httpOptions)
      .pipe(
        catchError(this.handleError),
        map(response => SalonProfileAssembler.toEntityFromResponse(response))
      );
  }

  updateImages(profileId: number, body: UpdateImagesDto): Observable<SalonProfile> {
    return this.updateProfile(profileId, {
      profileImageUrl: body.profileImageUrl,
      coverImageUrl: body.coverImageUrl
    });
  }








}
