export class ClientAppointment {
  id: number;
  clientId: number;
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

  constructor() {
    this.id = 0;
    this.clientId = 0;
    this.provider = {
      id: 0,
      name: '',
      companyName: ''
    }
    this.paymentId = {
      id: 0,
      amount: 0,
      currency: '',
      status: false
    }
    this.timeSlot = {
      id: 0,
      startTime: '',
      endTime: '',
      status: false,
      type: ''

    }
    this.workerId = {
      id: 0,
      name: '',
      specialization: ''
    }
  }
}
