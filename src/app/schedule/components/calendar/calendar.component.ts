import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ReservationComponent } from '../reservation/reservation.component';
import { ClientAppointment } from '../../../appointments/model/appointment.entity';
import { AppointmentApiService } from '../../../appointments/services/appointment-api-service.service';
import { ClientApiService } from '../../../iam/services/client-api.service';
import { Client } from '../../../iam/model/client.entity';
import { ClientAssembler } from '../../../iam/services/client.assembler';
import {
  AppointmentDetailDialogComponent
} from '../appointment-detail-dialog/appointment-detail-dialog.component';

const ALL_WORKERS = 'Todos';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  standalone: true,
  imports: [CommonModule, ReservationComponent, TranslatePipe, MatProgressSpinnerModule],
})
export class CalendarComponent implements OnInit {
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  hours = [
    '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  workers: string[] = [ALL_WORKERS];
  currentWorkerIndex = 0;

  calendars: ClientAppointment[] = [];
  clientNames: Map<number, string> = new Map();
  isLoading = true;

  get currentWorker(): string {
    return this.workers[this.currentWorkerIndex];
  }

  /** Nombre a mostrar del trabajador seleccionado (traduce el "Todos" interno). */
  get currentWorkerDisplay(): string {
    return this.currentWorker === ALL_WORKERS
      ? this.translate.instant('schedule.allWorkers')
      : this.currentWorker;
  }

  get hasAppointments(): boolean {
    return this.calendars.length > 0;
  }

  previousWorker(): void {
    this.currentWorkerIndex = (this.currentWorkerIndex - 1 + this.workers.length) % this.workers.length;
  }

  nextWorker(): void {
    this.currentWorkerIndex = (this.currentWorkerIndex + 1) % this.workers.length;
  }

  constructor(
    private appointmentService: AppointmentApiService,
    private clientService: ClientApiService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.appointmentService.getAppointments().subscribe(appointments => {
      this.calendars = appointments;
      this.isLoading = false;

      const workerSet = new Set<string>();
      for (const appointment of appointments) {
        this.clientService.getById(appointment.clientId).subscribe(c => {
          const client: Client = ClientAssembler.toEntityFromResource(c);
          this.clientNames.set(appointment.clientId, `${client.firstName} ${client.lastName}`);
        });

        if (appointment.workerId.name) {
          workerSet.add(appointment.workerId.name);
        }
      }

      this.workers = [ALL_WORKERS, ...Array.from(workerSet)];
    });
  }

  formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  isSameDay(dateStr: string, day: string): boolean {
    const date = new Date(dateStr);
    const formattedDay = date.toLocaleDateString('en-US', { weekday: 'long' });
    return formattedDay.toLowerCase() === day.toLowerCase();
  }

  isWithinHour(dateStr: string, hourStr: string): boolean {
    const date = new Date(dateStr);
    const hour = parseInt(hourStr.split(':')[0], 10);
    return date.getHours() === hour;
  }

  /** Compara un nombre de día de columna ('Monday', ...) contra la fecha actual. */
  isTodayColumn(day: string): boolean {
    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return todayName.toLowerCase() === day.toLowerCase();
  }

  /** Nombre del día traducido al idioma activo (los datos internos siempre están en inglés). */
  translatedDayLabel(index: number): string {
    const lang = this.translate.currentLang || 'en';
    // 1 de enero de 2024 fue lunes: sirve de referencia fija Lunes..Domingo.
    const reference = new Date(2024, 0, 1 + index);
    const label = reference.toLocaleDateString(lang, { weekday: 'long' });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  getClientName(clientId: number): string {
    return this.clientNames.get(clientId) ?? '…';
  }

  openDetail(appointment: ClientAppointment): void {
    this.dialog.open(AppointmentDetailDialogComponent, {
      width: '480px',
      maxWidth: '95vw',
      autoFocus: false,
      data: { appointment, clientName: this.getClientName(appointment.clientId) }
    });
  }
}
