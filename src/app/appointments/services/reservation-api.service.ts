import { Injectable } from '@angular/core';
import {BaseService} from '../../shared/services/base.service';
import {ReservationResponse} from './reservation.response';

@Injectable({
  providedIn: 'root'
})
export class ReservationApiService extends BaseService<ReservationResponse>{
override resourceEndpoint = '/reservationsDetails';
  constructor() {
    super();
  }
}
