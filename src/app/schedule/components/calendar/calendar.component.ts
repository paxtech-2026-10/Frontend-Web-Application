import { Component, OnInit} from '@angular/core';
import {NgForOf} from '@angular/common';
import {ReservationComponent} from '../reservation/reservation.component';
import { CommonModule } from '@angular/common';
import { Appointment} from '../../../dashboard/models/appointment.entity';
import {ClientAppointment} from '../../../appointments/model/appointment.entity';
import {AppointmentApiService} from '../../../appointments/services/appointment-api-service.service';
import {ClientApiService} from '../../../iam/services/client-api.service';
import {Client} from '../../../iam/model/client.entity';
import {ClientAssembler} from '../../../iam/services/client.assembler';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  standalone: true,
  imports: [
    NgForOf,
    ReservationComponent,
    CommonModule
  ], // Aquí luego agregaremos CommonModule y el ReservationComponent
})
export class CalendarComponent implements OnInit {
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  hours = [
    '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  workers: string[] = ['Todos']; // Inicializar para evitar error
  currentWorkerIndex: number = 0;


  /*
  workers = ['Todos', 'Gael Rivera', 'Kevin Chi'];
  currentWorkerIndex = 0;
  */

  get currentWorker(): string {
    return this.workers[this.currentWorkerIndex];
  }

  swapWorker(): void {
    this.currentWorkerIndex = (this.currentWorkerIndex + 1) % this.workers.length;
  }
  /*
  calendars: Appointment[] = [];

  constructor(private appointmentService: AppointmentApiService) {}

  ngOnInit(): void {
    this.appointmentService.getAppointments().subscribe(
      appointments => {
        this.calendars = appointments;
        console.log(this.calendars);

        const workerSet = new Set<string>();
        for (const appointment of appointments) {
          if (appointment.workerName) {
            workerSet.add(appointment.workerName);
          }
        }

        this.workers = ['Todos', ...Array.from(workerSet)];

      });

  }*/
  calendars: ClientAppointment[] = [];
  client!: Client;
  clientNames: Map<number, string> = new Map();

  constructor(private appointmentService: AppointmentApiService, private clientService: ClientApiService) {}

  ngOnInit(): void {
    this.appointmentService.getAppointments().subscribe(
      appointments => {
        this.calendars = appointments;
        console.log(this.calendars);

        const workerSet = new Set<string>();
        for (const appointment of appointments) {

          this.clientService.getById(appointment.clientId).subscribe(c => {
            this.client = ClientAssembler.toEntityFromResource(c);
            let clientName = this.client.firstName + " " + this.client.lastName;
            this.clientNames.set(appointment.clientId, clientName);
            }
          )

          if (appointment.workerId.name) {
            workerSet.add(appointment.workerId.name);
          }
        }

        this.workers = ['Todos', ...Array.from(workerSet)];

      });
    console.log("Prueba formatTime:", this.formatTime("2025-07-05T06:40:00"));
    console.log("Prueba formatDay:", this.formatDay("2025-07-05T06:40:00"));



  }

  formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }


  formatDay(dateStr: string): string {
    const date = new Date(dateStr);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    return day.charAt(0).toUpperCase() + day.slice(1);
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



  isToday(dateStr: string): boolean {
    const today = new Date();
    const date = new Date(dateStr);
    return today.toDateString() == date.toDateString();
  }

  getClientName(clientId: number): string {
    return this.clientNames.get(clientId) ?? 'Loading...'
  }



}
