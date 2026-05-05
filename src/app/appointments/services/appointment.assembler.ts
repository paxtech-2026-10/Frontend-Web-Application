import {ClientAppointment} from '../model/appointment.entity';
import {AppointmentResponse} from './appointment.response';

export class AppointmentAssembler {
  private static emptyProvider() {
    return { id: 0, name: '', companyName: '' };
  }
  private static emptyPayment() {
    return { id: 0, amount: 0, currency: '', status: false };
  }
  private static emptyTimeSlot() {
    return { id: 0, startTime: '', endTime: '', status: false, type: '' };
  }
  private static emptyWorker() {
    return { id: 0, name: '', specialization: '' };
  }
  static toEntityFromResource(resource: AppointmentResponse): ClientAppointment {
    return {
      id: resource.id ?? 0,
      clientId: resource.clientId ?? 0,
      provider:   resource.provider   ?? this.emptyProvider(),
      paymentId:  resource.paymentId  ?? this.emptyPayment(),
      timeSlot:   resource.timeSlot   ?? this.emptyTimeSlot(),
      workerId:   resource.workerId   ?? this.emptyWorker()
    };
  }

  static toEntitiesFromResponse(resources: AppointmentResponse[]): ClientAppointment[] {
    return resources.map(resource => this.toEntityFromResource(resource));
  }
}
