import {Component, OnInit} from '@angular/core';
import {StaffListComponent} from '../../../dashboard/components/staff-list/staff-list.component';
import {Worker} from '../../../dashboard/models/worker.entity';
import {WorkerApiService} from '../../../dashboard/services/worker-api.service';
import {MatButton} from '@angular/material/button';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';

import {AppointmentApiService} from '../../../dashboard/services/appointment-api.service';  // importa servicio citas
import {WeekCalendarComponent} from '../../components/calendar-container/calendar-container.component';
import {Service} from '../../../services/model/service.entity';

@Component({
  selector: 'app-appointment-maker',
  imports: [
    StaffListComponent,
    MatButton,
    MatIcon,
    RouterLink,
    WeekCalendarComponent
  ],
  templateUrl: './appointment-maker.component.html',
  styleUrl: './appointment-maker.component.css'
})


export class AppointmentMakerComponent implements OnInit {
  worker: Worker[] = [];
  selectedDate: Date | null = null;
  availableTimes: string[] = [];

  selectedService!: Service;
  selectedWorker!: Worker;

  onDateSelected(date: Date) {
    this.selectedDate = date;
    this.availableTimes = this.generateTimeOptions(date);
  }

  generateTimeOptions(date: Date): string[] {
    // Aquí podrías consultar disponibilidad real. Por ahora: mock.
    const options = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM'];
    return options.slice(0, 6); // Limita a 3
  }

  // Guardamos selección para POST
  selectedReservation: {date: Date, timeSlot: any} | null = null;

  constructor(
    private staffService: WorkerApiService,
    private appointmentService: AppointmentApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.staffService.getWorkers().subscribe(worker => this.worker = worker);

    this.staffService.getWorkers().subscribe(workers => {
      if (workers.length > 0) {
        this.selectedWorker = workers[0];
      } else {
        console.warn('⚠ No hay trabajadores disponibles');
      }
    });


    this.selectedService = history.state.selectedService
      ?? this.router.getCurrentNavigation()?.extras.state?.['selectedService'];

    if (!this.selectedService) {
      // El usuario recargó la página o llegó directo sin state.
      // Aquí decides qué hacer: redirigir, volver a cargar desde la API, etc.
      console.warn('No se recibió selectedService en el navigation state');
      // this.router.navigate(['/client/services', this.providerId]);
  }}

  onReservationConfirmed(event: {date: Date, timeSlot: any}) {
    this.selectedReservation = event;
  }

  bookAppointment() {
    if (!this.selectedReservation) {
      alert('Por favor seleccione fecha y rango horario');
      return;
    }

    // Construir payload con los datos estáticos + fecha y hora seleccionada
    const date = this.selectedReservation.date;
    const slot = this.selectedReservation.timeSlot;

    // Construir fechas completas con día seleccionado + hora rango
    const startDate = new Date(date);
    startDate.setHours(slot.start.getHours(), slot.start.getMinutes(), 0, 0);

    const endDate = new Date(date);
    endDate.setHours(slot.end.getHours(), slot.end.getMinutes(), 0, 0);

  }
}
