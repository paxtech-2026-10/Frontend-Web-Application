export interface AppointmentResponse {
  reservationId: string;
  tipo: string;
  client: {
    clientId: string;
    birthDate: string;
    user: {
      userId: string;
      name: string;
    };
  };
  salon: {
    salonId: number;
  };
  payment: {
    paymentId: string;
    amount: number;
    currency: string;
    status: boolean;
  };
  timeSlot: {
    timeSlotId: string;
    start: string;
    end: string;
    status: boolean;
    tipo: string;
  };
  worker: {
    workerId: string;
    name:string;
  };
}
