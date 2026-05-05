import {Component, Input, OnInit} from '@angular/core';

import { CommonModule } from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import {ClientAppointment} from '../../../appointments/model/appointment.entity';
import {AppointmentApiService} from '../../../appointments/services/appointment-api-service.service';
import {filter} from 'rxjs';


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
      this.upcomingAppointments = appointments
        .filter(a => new Date(a.timeSlot.startTime) > now)
        .sort((a, b) => new Date(a.timeSlot.startTime).getTime() - new Date(b.timeSlot.endTime).getTime())
        .slice(0, 3);

      if (this.isClient) {
        this.upcomingAppointments = this.upcomingAppointments.filter(a => a.provider.id == Number(localStorage.getItem('clientId')));
      } else{
        this.upcomingAppointments = this.upcomingAppointments.filter(a => a.provider.id == Number(localStorage.getItem('providerId')));
      }

      console.log('Upcoming Appointments:', this.upcomingAppointments)
    });
    console.log(this.upcomingAppointments);
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
