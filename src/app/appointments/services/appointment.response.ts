export interface AppointmentResponse {
  id: number;
  clientId: number,
  client: {
    id: number;
    fullName: string;
  };
  provider: {
    id: number;
    name: string;
    companyName: string;
  };
  serviceId: {
    id: number;
    name: string;
    duration: number;
    price: number;
    providerId: number;
  };
  paymentId: {
    id: number;
    amount: number;
    currency: string;
    status: boolean;
  };
  timeSlot: {
    id: number;
    startTime: string;
    endTime: string;
    status: boolean;
    type: string;
  };
  workerId: {
    id: number,
    name: string;
    specialization: string;
  }
}
