export class Notifications {
id: number;
notificationDate: Date;
message: string;
salonId: number;
clientId: number;
iconURL: string;
read: boolean;
constructor() {
  this.id = 0;
  this.notificationDate = new Date();
  this.message = '';
  this.salonId = 0;
  this.clientId = 0;
  this.iconURL = '';
  this.read = false;
}
}
