import { Injectable } from '@angular/core';
import {BaseService} from '../../shared/services/base.service';
import {ClientResponse} from './client.response';

@Injectable({
  providedIn: 'root'
})
export class ClientApiService extends BaseService<ClientResponse>{
  override resourceEndpoint = '/clients';
  constructor() {
    super();
  }
}
