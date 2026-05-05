import { Component, OnInit } from '@angular/core';
import {ClientAppointment} from '../../model/appointment.entity';
import {AppointmentApiService} from '../../services/appointment-api-service.service';
import {AppointmentsItemComponent} from '../appointments-item/appointments-item.component';
import {NgForOf} from '@angular/common';
import {ReviewApiService} from '../../../reviews/services/review-api.service';
import {Review} from '../../../reviews/models/review.entity';
import {ReviewListComponent} from '../review-list/review-list.component';
import {TranslatePipe} from '@ngx-translate/core';


@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  imports: [
    AppointmentsItemComponent,
    NgForOf,
    ReviewListComponent,
    ReviewListComponent,
    TranslatePipe,
  ],
  styleUrls: ['./appointments-list.component.css']
})
export class AppointmentsListComponent implements OnInit {
  appointments: ClientAppointment[] = [];
  reviews: Review[] = [];


  constructor(private appointmentService: AppointmentApiService, private reviewService: ReviewApiService) {}



  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        console.log('Received appointments data:', data);
        this.appointments = data;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
      }
    });

    this.reviewService.getReviews().subscribe({
      next: (data) => {
        console.log('Received review data:', data);
        this.reviews =data;
      },
      error: (error) => {
        console.error('Error loading review data:', error);
      }
    })
  }

  trackById(index: number, item: ClientAppointment): number {
    return item.id;
  }
}
