export class Appointment {
  reservationId: string;
  tipo: string;
  clientName: string;
  paymentStatus: boolean;
  salonName: string;
  timeSlotStart: string;
  timeSlotEnd: string;
  workerName: string;
  salonId: number;

  constructor() {
    this.reservationId = '';
    this.tipo = '';
    this.clientName = '';
    this.paymentStatus = false;
    this.timeSlotStart = '';
    this.salonName = '';
    this.timeSlotEnd = '';
    this.workerName = '';
    this.salonId = 0;
  }
}
