import { Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StaffListComponent } from '../../../dashboard/components/staff-list/staff-list.component';
import { Worker } from '../../../dashboard/models/worker.entity';
import { WorkerApiService } from '../../../dashboard/services/worker-api.service';
import { Service } from '../../../services/model/service.entity';
import { WeekCalendarComponent } from '../../components/calendar-container/calendar-container.component';

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
  selectedReservation: { date: Date, timeSlot: any } | null = null;

  selectedService?: Service;
  selectedWorker?: Worker;
  providerId = 0;

  constructor(
    private staffService: WorkerApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const navigationState = {
      ...history.state,
      ...(this.router.getCurrentNavigation()?.extras.state ?? {})
    };

    this.selectedService = navigationState['selectedService'];
    this.providerId = Number(navigationState['providerId'] ?? this.route.snapshot.paramMap.get('id'));

    if (!this.selectedService) {
      console.warn('No se recibio selectedService en el navigation state');
    }

    this.loadProviderWorkers();
  }

  onDateSelected(date: Date): void {
    this.selectedDate = date;
    this.availableTimes = this.generateTimeOptions();
  }

  generateTimeOptions(): string[] {
    return ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM'];
  }

  selectWorker(worker: Worker): void {
    this.selectedWorker = worker;
  }

  onReservationConfirmed(event: { date: Date, timeSlot: any }): void {
    this.selectedReservation = event;
  }

  private loadProviderWorkers(): void {
    this.staffService.getWorkers().subscribe(workers => {
      const providerWorkers = workers.filter(worker => worker.providerId === this.providerId);
      this.worker = providerWorkers;
      this.selectedWorker = providerWorkers[0];

      if (!this.selectedWorker) {
        console.warn('No hay trabajadores disponibles para este proveedor');
      }
    });
  }
}
