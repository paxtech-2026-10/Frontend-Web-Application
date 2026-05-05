export class TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  status: boolean;
  type: string;
  constructor() {
    this.id = 0;
    this.startTime = '';
    this.endTime = '';
    this.status = false;
    this.type = '';
  }
}
