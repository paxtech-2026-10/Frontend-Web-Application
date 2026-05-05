export interface AppointmentResponse {
  id: number;
  clientId: number,
  provider: {
    id: number;
    name: string;
    companyName: string;
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
