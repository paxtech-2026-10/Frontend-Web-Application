export class ClientAppointment {
  id: number;
  clientId: number;
  client: {
    id: number;
    fullName: string;
  };
  provider: {
    id: number;
    name: string;
    companyName: string;
  };
  service: {
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

  constructor() {
    this.id = 0;
    this.clientId = 0;
    this.client = {
      id: 0,
      fullName: ''
    }
    this.provider = {
      id: 0,
      name: '',
      companyName: ''
    }
    this.service = {
      id: 0,
      name: '',
      duration: 0,
      price: 0,
      providerId: 0
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
