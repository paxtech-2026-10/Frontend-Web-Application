import { Injectable } from '@angular/core';
import {BaseService} from '../../shared/services/base.service';
import {NotificationResource} from './notification.resource';

@Injectable({
  providedIn: 'root'
})
export class NotificationApiService extends BaseService<NotificationResource>{
override resourceEndpoint = '/notifications';
  constructor() {
    super();
  }
}
