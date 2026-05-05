export class Payment {
  id: number;
  amount: number;
  currency: string;
  status: boolean;
  constructor() {
    this.id = 0;
    this.amount = 0;
    this.currency = '';
    this.status = false;
  }
}
