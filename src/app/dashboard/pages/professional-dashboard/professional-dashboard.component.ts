import {Component, OnInit} from '@angular/core';
import {Worker} from '../../models/worker.entity';
import {WorkerApiService} from '../../services/worker-api.service';
import {StaffListComponent} from '../../components/staff-list/staff-list.component';
import {UpcomingAppointmentsComponent} from '../../components/upcoming-appointments/upcoming-appointments.component';
import {Review} from '../../../reviews/models/review.entity';
import {ReviewApiService} from '../../../reviews/services/review-api.service';
import {ReviewListComponent} from '../../components/review-list/review-list.component';
import {TranslatePipe} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {WorkerDialogComponent} from '../../components/worker-dialog/worker-dialog.component';
import {WorkerResource} from '../../services/worker.resource';
import {AccountApiService} from '../../../iam/services/accountApi.service';
import {AddressDialogComponent, AddressDialogResult} from '../../../shared/components/address-dialog/address-dialog.component';
import {ServiceApiService} from '../../../services/services/services-api.service';
import {AppointmentApiService} from '../../../appointments/services/appointment-api-service.service';
import {ClientAppointment} from '../../../appointments/model/appointment.entity';
@Component({
  selector: 'app-professional-dashboard',
  imports: [
    StaffListComponent,
    UpcomingAppointmentsComponent,
    ReviewListComponent,
    TranslatePipe
  ],
  templateUrl: './professional-dashboard.component.html',
  styleUrl: './professional-dashboard.component.css'
})
export class ProfessionalDashboardComponent implements OnInit {
  worker: Worker[] = [];
  reviews: Review[] = [];
  servicesCount = 0;
  todayAppointments: ClientAppointment[] = [];
  businessAddress: string | null = null;
  private providerProfileId: number | null = null;

  get workersCount(): number {
    return this.worker.length;
  }

  get hasAddress(): boolean {
    return !!this.businessAddress;
  }

  get reviewsCount(): number {
    return this.reviews.length;
  }

  get todayCount(): number {
    return this.todayAppointments.length;
  }

  /** Ganancia del día: suma de los pagos de las citas de hoy (fallback: precio del servicio). */
  get dailyEarnings(): string {
    const total = this.todayAppointments.reduce(
      (acc, a) => acc + (a.paymentId?.amount || a.service?.price || 0), 0);
    return `S/ ${total.toFixed(2)}`;
  }

  get avgRating(): string {
    if (!this.reviews.length) return '0.0';
    const sum = this.reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0);
    return (sum / this.reviews.length).toFixed(1);
  }

  constructor(
    private staffService: WorkerApiService,
    private reviewService: ReviewApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private accountService: AccountApiService,
    private serviceApi: ServiceApiService,
    private appointmentService: AppointmentApiService
  ) {
  }
  ngOnInit() {
    this.loadDashboardData();
    this.loadBusinessAddress();
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
    this.serviceApi.getServices().subscribe(services =>
      this.servicesCount = services.filter(s => s.providerId === providerId).length);
    this.appointmentService.getAppointments().subscribe(appointments => {
      const today = new Date().toDateString();
      this.todayAppointments = appointments.filter(a =>
        a.provider.id === providerId && new Date(a.timeSlot.startTime).toDateString() === today);
    });
  }

  /** Carga el perfil del provider para saber si ya tiene una dirección vinculada. */
  private loadBusinessAddress() {
    const providerId = Number(localStorage.getItem('providerId'));
    if (!providerId) return;

    this.accountService.getProviderProfileByProviderId(providerId).subscribe({
      next: (profile: { id: number; location?: string }) => {
        this.providerProfileId = profile.id;
        this.businessAddress = this.parseAddress(profile.location);
      },
      error: () => { /* sin perfil aún: se mostrará el CTA para vincular dirección */ }
    });
  }

  /** La ubicación puede venir como "direccion|lat,lon"; devuelve solo la parte legible. */
  private parseAddress(location?: string): string | null {
    if (!location) return null;
    const display = location.split('|')[0].trim();
    return display.length ? display : null;
  }

  openAddressDialog() {
    const dialogRef = this.dialog.open(AddressDialogComponent, {
      width: '560px',
      maxWidth: '95vw',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: AddressDialogResult | undefined) => {
      if (!result) return;
      if (!this.providerProfileId) {
        this.snackBar.open('No provider profile found to link the address.', 'Close', { duration: 3000, panelClass: 'u-snack-error' });
        return;
      }

      // Guardamos "direccion|lat,lon" para conservar las coordenadas.
      const location = `${result.address}|${result.lat},${result.lon}`;
      this.accountService.updateProviderProfile(this.providerProfileId, { location }).subscribe({
        next: () => {
          this.businessAddress = result.address;
          this.snackBar.open('Address linked to your business!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'u-snack-success'
          });
        },
        error: () => {
          this.snackBar.open('Could not save the address. Please try again.', 'Close', { duration: 3000, panelClass: 'u-snack-error' });
        }
      });
    });
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
