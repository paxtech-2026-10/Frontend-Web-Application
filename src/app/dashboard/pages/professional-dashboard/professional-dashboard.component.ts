import {Component, OnInit} from '@angular/core';
import {Worker} from '../../models/worker.entity';
import {WorkerApiService} from '../../services/worker-api.service';
import {StaffListComponent} from '../../components/staff-list/staff-list.component';
import {UpcomingAppointmentsComponent} from '../../components/upcoming-appointments/upcoming-appointments.component';
import {Review} from '../../../reviews/models/review.entity';
import {ReviewApiService} from '../../../reviews/services/review-api.service';
import {ReviewListComponent} from '../../components/review-list/review-list.component';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {TranslatePipe} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {WorkerDialogComponent} from '../../components/worker-dialog/worker-dialog.component';
import {WorkerResource} from '../../services/worker.resource';
@Component({
  selector: 'app-professional-dashboard',
  imports: [
    StaffListComponent,
    UpcomingAppointmentsComponent,
    ReviewListComponent,
    MatCard,
    MatCardContent,
    TranslatePipe
  ],
  templateUrl: './professional-dashboard.component.html',
  styleUrl: './professional-dashboard.component.css'
})
export class ProfessionalDashboardComponent implements OnInit {
  worker: Worker[] = [];
  reviews: Review[] = [];

  constructor(
    private staffService: WorkerApiService,
    private reviewService: ReviewApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }
  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {

    const providerId = Number(localStorage.getItem('providerId'));
    if (!providerId) {
      console.warn('⚠️ No se encontró providerId en localStorage');
      return;
    }
    console.log('providerId:', providerId);
    this.staffService.getWorkers().subscribe(worker => this.worker = worker.filter(w => w.providerId === providerId));
    this.reviewService.getReviews().subscribe(reviews => this.reviews = reviews.filter(r => r.salonId === providerId));
  }

  openCreateWorkerDialog() {
    const dialogRef = this.dialog.open(WorkerDialogComponent);

    dialogRef.afterClosed().subscribe((result: WorkerResource | undefined) => {
      if (!result) return;

      const providerId = Number(localStorage.getItem('providerId'));
      if (!providerId) {
        this.snackBar.open('No active provider session found.', 'Close', { duration: 3000 });
        return;
      }

      const worker: WorkerResource = { ...result, providerId };
      this.staffService.post(worker).subscribe({
        next: () => {
          this.snackBar.open('Staff member created.', 'Close', { duration: 2000 });
          this.loadDashboardData();
        },
        error: () => {
          this.snackBar.open('Could not create staff member.', 'Close', { duration: 3000 });
        }
      });
    });
  }
}
