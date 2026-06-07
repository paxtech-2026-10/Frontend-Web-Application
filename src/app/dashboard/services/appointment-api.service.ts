// ─────────────────────────────────────────────────────────────────────────────
// CÓDIGO MUERTO (2026-06-03)
// Servicio desfasado. Su único importador es el componente huérfano
// `appointments/components/upcoming-appointments` (selector `app-upcoming-appointments-client`),
// que no se renderiza en ninguna vista.
// El endpoint estaba mal escrito (`/reservationDetails`, singular → 401 en el
// backend); se corrigió a `/reservationsDetails/details`, pero el assembler y el
// modelo asociados (`appointment.assembler.ts`, `models/appointment.entity.ts`)
// siguen esperando una forma de respuesta antigua (client.user.name, salon.salonId,
// payment.status) que el backend ya no devuelve, por lo que crashearía en runtime.
// El flujo vivo usa `appointments/services/appointment-api-service.service.ts`.
// Candidato a eliminación.
// ─────────────────────────────────────────────────────────────────────────────
import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { AppointmentResponse } from './appointment.response';
import { Appointment } from '../models/appointment.entity';
import { AppointmentAssembler } from './appointment.assembler';
import {Observable, map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentApiService extends BaseService<AppointmentResponse> {
  override resourceEndpoint = '/reservationsDetails/details';

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
