import {Component, Input, OnInit} from '@angular/core';

import { CommonModule } from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import {ClientAppointment} from '../../../appointments/model/appointment.entity';
import {AppointmentApiService} from '../../../appointments/services/appointment-api-service.service';


@Component({
  selector: 'app-upcoming-appointments',
  templateUrl: './upcoming-appointments.component.html',
  styleUrls: ['./upcoming-appointments.component.css'],
  imports: [CommonModule, TranslatePipe]
})
export class UpcomingAppointmentsComponent implements OnInit {
    upcomingAppointments: ClientAppointment[] = [];
    @Input() isClient: boolean = false;

  constructor(private appointmentService: AppointmentApiService, private translate: TranslateService) {}

  ngOnInit(): void {
    this.appointmentService.getAppointments().subscribe(appointments => {
      const now = new Date();
      const clientId = Number(localStorage.getItem('clientId'));
      const providerId = Number(localStorage.getItem('providerId'));

      this.upcomingAppointments = appointments
        // Keep only the current user's appointments BEFORE slicing, so their
        // upcoming items aren't dropped by an unrelated global top-3.
        .filter(a => this.isClient ? a.clientId === clientId : a.provider.id === providerId)
        .filter(a => new Date(a.timeSlot.startTime) > now)
        .sort((a, b) => new Date(a.timeSlot.startTime).getTime() - new Date(b.timeSlot.startTime).getTime())
        .slice(0, 3);
    });
  }

  formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const currentLang = this.translate.currentLang || 'en';
    return date.toLocaleTimeString(currentLang, { hour: 'numeric', minute: '2-digit' });
  }

  formatDay(dateStr: string): string {
    const date = new Date(dateStr);
    const currentLang = this.translate.currentLang || 'en';
    return date.toLocaleDateString(currentLang, { weekday: 'long', day: 'numeric' });
  }


  isToday(dateStr: string): boolean {
    const today = new Date();
    const date = new Date(dateStr);
    return today.toDateString() === date.toDateString();
  }
}
