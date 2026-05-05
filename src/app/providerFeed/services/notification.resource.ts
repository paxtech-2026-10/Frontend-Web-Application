export interface NotificationResource {
  id: number;
  notificationDate: Date;
  message: string;
  salonId: number;
  clientId: number;
  iconURL: string;
  reservationDetailsId: number;
  read: boolean;
}
