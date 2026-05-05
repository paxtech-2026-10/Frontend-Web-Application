import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { ProfileSalonResponse } from './profile-salon.response';
import { SalonProfile } from '../models/salon-profile.entity';
import {catchError, map, Observable, retry} from 'rxjs';
import { SalonProfileAssembler } from './salon-profile.assembler';
import {UpdateImagesDto} from '../models/profile.entity';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalonProfileApiService extends BaseService<ProfileSalonResponse> {
  override resourceEndpoint = '/provider-profiles';
  private base = `${environment.serverBaseUrl}/providerProfiles`;

  constructor() {
    super();
  }

  public getProfileById(id: number): Observable<ProfileSalonResponse> {
    return this.http.get<ProfileSalonResponse>(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError),
        map(response => SalonProfileAssembler.toEntityFromResponse(response))
      );
  }

  updateImages(body: UpdateImagesDto) {
    return this.http.put<void>(`${this.base}`, body);
  }








}
