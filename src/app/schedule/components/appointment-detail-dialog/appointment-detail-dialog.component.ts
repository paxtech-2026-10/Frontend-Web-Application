import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ClientAppointment } from '../../../appointments/model/appointment.entity';

export interface AppointmentDetailDialogData {
  appointment: ClientAppointment;
  clientName: string;
}

@Component({
  selector: 'app-appointment-detail-dialog',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './appointment-detail-dialog.component.html',
  styleUrl: './appointment-detail-dialog.component.css'
})
export class AppointmentDetailDialogComponent {
  appointment: ClientAppointment;
  clientName: string;

  constructor(
    public dialogRef: MatDialogRef<AppointmentDetailDialogComponent>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) data: AppointmentDetailDialogData
  ) {
    this.appointment = data.appointment;
    this.clientName = data.clientName;
  }

  get formattedDate(): string {
    const date = new Date(this.appointment.timeSlot.startTime);
    const lang = this.translate.currentLang || 'en';
    return date.toLocaleDateString(lang, { weekday: 'long', day: 'numeric', month: 'long' });
  }

  get formattedTimeRange(): string {
    const lang = this.translate.currentLang || 'en';
    const start = new Date(this.appointment.timeSlot.startTime)
      .toLocaleTimeString(lang, { hour: 'numeric', minute: '2-digit' });
    const end = new Date(this.appointment.timeSlot.endTime)
      .toLocaleTimeString(lang, { hour: 'numeric', minute: '2-digit' });
    return `${start} – ${end}`;
  }

  get isPaid(): boolean {
    return !!this.appointment.paymentId?.status;
  }

  get amount(): string {
    const currency = this.appointment.paymentId?.currency || '';
    const value = this.appointment.paymentId?.amount ?? this.appointment.service?.price ?? 0;
    return `${currency} ${value.toFixed(2)}`.trim();
  }

  close(): void {
    this.dialogRef.close();
  }
}
