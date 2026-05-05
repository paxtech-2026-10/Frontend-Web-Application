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
