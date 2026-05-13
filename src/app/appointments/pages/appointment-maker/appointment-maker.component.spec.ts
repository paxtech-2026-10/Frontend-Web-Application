import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { AppointmentMakerComponent } from './appointment-maker.component';
import { WorkerApiService } from '../../../dashboard/services/worker-api.service';
import { AppointmentApiService as DashboardAppointmentApiService } from '../../../dashboard/services/appointment-api.service';
import { AppointmentApiService as AppointmentsAppointmentApiService } from '../../services/appointment-api-service.service';
import { TimeSlotApiService } from '../../services/time-slot-api.service';
import { PaymentApiService } from '../../services/payment-api.service';
import { ReservationApiService } from '../../services/reservation-api.service';

describe('AppointmentMakerComponent', () => {
  let component: AppointmentMakerComponent;
  let fixture: ComponentFixture<AppointmentMakerComponent>;
  let workerApiSpy: jasmine.SpyObj<WorkerApiService>;
  let appointmentApiSpy: jasmine.SpyObj<DashboardAppointmentApiService>;
  let calendarAppointmentApiSpy: jasmine.SpyObj<AppointmentsAppointmentApiService>;

  beforeEach(async () => {
    workerApiSpy = jasmine.createSpyObj('WorkerApiService', ['getWorkers']);
    appointmentApiSpy = jasmine.createSpyObj('DashboardAppointmentApiService', ['create']);
    calendarAppointmentApiSpy = jasmine.createSpyObj('AppointmentsAppointmentApiService', ['getAll']);
    workerApiSpy.getWorkers.and.returnValue(of([
      { id: 1, name: 'Mia', specialization: 'Stylist', photoUrl: 'mia.jpg', providerId: 4 }
    ]));
    calendarAppointmentApiSpy.getAll.and.returnValue(of([]));

    TestBed.overrideComponent(AppointmentMakerComponent, {
      set: {
        imports: [],
        template: '<div></div>'
      }
    });

    await TestBed.configureTestingModule({
      imports: [AppointmentMakerComponent],
      providers: [
        { provide: WorkerApiService, useValue: workerApiSpy },
        { provide: DashboardAppointmentApiService, useValue: appointmentApiSpy },
        { provide: AppointmentsAppointmentApiService, useValue: calendarAppointmentApiSpy },
        { provide: TimeSlotApiService, useValue: jasmine.createSpyObj('TimeSlotApiService', ['post']) },
        { provide: PaymentApiService, useValue: jasmine.createSpyObj('PaymentApiService', ['post']) },
        { provide: ReservationApiService, useValue: jasmine.createSpyObj('ReservationApiService', ['post']) },
        {
          provide: Router,
          useValue: {
            getCurrentNavigation: () => ({
              extras: { state: { selectedService: { id: 1, name: 'Cut', duration: 30, price: 20, providerId: 1 } } }
            })
          }
        },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentMakerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load workers and set selectedWorker on init', () => {
    spyOnProperty(history, 'state', 'get').and.returnValue({
      selectedService: { id: 1, name: 'Cut', duration: 30, price: 20, providerId: 1 }
    });

    component.ngOnInit();

    expect(workerApiSpy.getWorkers).toHaveBeenCalledTimes(2);
    expect(component.worker.length).toBe(1);
    expect(component.selectedWorker?.name).toBe('Mia');
  });
});
