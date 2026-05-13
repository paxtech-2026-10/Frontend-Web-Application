import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { AppointmentMakerComponent } from './appointment-maker.component';
import { WorkerApiService } from '../../../dashboard/services/worker-api.service';
import { AppointmentApiService } from '../../../dashboard/services/appointment-api.service';
import { StaffListComponent } from '../../../dashboard/components/staff-list/staff-list.component';
import { TranslateModule } from '@ngx-translate/core';

describe('AppointmentMakerComponent workers integration', () => {
  let component: AppointmentMakerComponent;
  let fixture: ComponentFixture<AppointmentMakerComponent>;
  let workerApiSpy: jasmine.SpyObj<WorkerApiService>;

  beforeEach(async () => {
    workerApiSpy = jasmine.createSpyObj('WorkerApiService', ['getWorkers']);
    workerApiSpy.getWorkers.and.returnValue(of([
      { id: 5, name: 'Mia', specialization: 'Stylist', photoUrl: 'mia.jpg', providerId: 7 },
      { id: 6, name: 'Noah', specialization: 'Barber', photoUrl: 'noah.jpg', providerId: 7 }
    ]));

    TestBed.overrideComponent(AppointmentMakerComponent, {
      set: {
        imports: [StaffListComponent, TranslateModule],
        template: '<app-staff-list [WorkerList]="worker"></app-staff-list>'
      }
    });

    await TestBed.configureTestingModule({
      imports: [AppointmentMakerComponent, TranslateModule.forRoot()],
      providers: [
        { provide: WorkerApiService, useValue: workerApiSpy },
        { provide: AppointmentApiService, useValue: jasmine.createSpyObj('AppointmentApiService', ['create']) },
        {
          provide: Router,
          useValue: {
            getCurrentNavigation: () => ({
              extras: { state: { selectedService: { id: 1, name: 'Cut', duration: 30, price: 20, providerId: 7 }, providerId: 7 } }
            })
          }
        },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '7' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentMakerComponent);
    component = fixture.componentInstance;
  });

  it('should load workers and render them in staff list', () => {
    spyOnProperty(history, 'state', 'get').and.returnValue({
      selectedService: { id: 1, name: 'Cut', duration: 30, price: 20, providerId: 7 },
      providerId: 7
    });

    component.ngOnInit();
    fixture.detectChanges();

    const staffItems = fixture.nativeElement.querySelectorAll('app-staff-item');

    expect(component.worker.length).toBe(2);
    expect(component.selectedWorker?.name).toBe('Mia');
    expect(staffItems.length).toBe(2);
  });
});
