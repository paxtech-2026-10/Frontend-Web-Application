import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { AppointmentResponse } from './appointment.response';
import { Appointment } from '../models/appointment.entity';
import { AppointmentAssembler } from './appointment.assembler';
import {Observable, map, retry, catchError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentApiService extends BaseService<AppointmentResponse> {
  override resourceEndpoint = '/reservationDetails';

  constructor() {
    super();
  }

  /** Convierte los response en entidades limpias */
  public getAppointments(): Observable<Appointment[]> {
    return this.getAll().pipe(
      map(response => AppointmentAssembler.toEntitiesFromResponse(response))
    );
  }
}
