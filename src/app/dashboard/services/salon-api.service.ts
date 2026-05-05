import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ProviderProfileResource} from './Salon.response';

import {BaseService} from '../../shared/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class SalonApiService extends BaseService<ProviderProfileResource>{
  private baseUrl = environment.serverBaseUrl;
  private detailsEndpoint = "/provider-profiles";
  override resourceEndpoint = '/provider-profiles';

  constructor() {
    super();
  }

}
