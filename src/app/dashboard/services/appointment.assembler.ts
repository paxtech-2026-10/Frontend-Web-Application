  // ───────────────────────────────────────────────────────────────────────────
  // CÓDIGO MUERTO (2026-06-03)
  // Assembler desfasado. Solo lo usa `dashboard/services/appointment-api.service.ts`
  // (también muerto), consumido por un componente huérfano que no se renderiza.
  // Mapea desde una forma de respuesta antigua que el backend ya NO devuelve:
  // `resource.client.user.name`, `resource.timeSlot.start/end`, `resource.worker.name`
  // y, sobre todo, `resource.salon.salonId` → `salon` viene `undefined` en el payload
  // real de /reservationsDetails/details, por lo que esto lanzaría TypeError en runtime.
  // El assembler vigente es `appointments/services/appointment.assembler.ts` (null-safe).
  // Candidato a eliminación.
  // ───────────────────────────────────────────────────────────────────────────
  import {Appointment} from '../models/appointment.entity';
  import {AppointmentResponse} from './appointment.response';

  export class AppointmentAssembler {
    static toEntityFromResource(resource: AppointmentResponse): Appointment {
      if (!resource.client?.user?.name) {
        console.warn(`Client name missing for reservationId: ${resource.reservationId}`, resource.client);
      }
      return {
        reservationId: resource.reservationId || '',
        tipo: resource.tipo || '',
        clientName: resource.client?.user?.name || 'Unknown Client',
        paymentStatus: resource.payment?.status ?? false,
        salonName: '',
        timeSlotStart: resource.timeSlot?.start || '',
        timeSlotEnd: resource.timeSlot?.end || '',
        workerName: resource.worker?.name || 'Unknown Worker',
        salonId: resource.salon.salonId
      };
    }
    static toEntitiesFromResponse(resources: AppointmentResponse[]): Appointment[] {
      return resources.map(resource => this.toEntityFromResource(resource));
    }
  }
