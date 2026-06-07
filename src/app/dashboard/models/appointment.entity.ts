// ─────────────────────────────────────────────────────────────────────────────
// CÓDIGO MUERTO (2026-06-03)
// Modelo desfasado, usado solo por `dashboard/services/appointment.assembler.ts`
// y `dashboard/services/appointment-api.service.ts` (ambos muertos), a su vez
// consumidos por un componente huérfano que no se renderiza en ninguna vista.
// Sus campos (reservationId, clientName, salonName, paymentStatus, salonId...) ya
// no se corresponden con la respuesta real del backend; el modelo vigente es
// `appointments/model/appointment.entity.ts` (ClientAppointment). Candidato a eliminación.
// ─────────────────────────────────────────────────────────────────────────────
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
