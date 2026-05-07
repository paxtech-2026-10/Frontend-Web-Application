import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { ProfessionalDashboardComponent } from './professional-dashboard.component';
import { WorkerApiService } from '../../services/worker-api.service';
import { ReviewApiService } from '../../../reviews/services/review-api.service';
import { StaffListComponent } from '../../components/staff-list/staff-list.component';

describe('ProfessionalDashboardComponent workers integration', () => {
  let component: ProfessionalDashboardComponent;
  let fixture: ComponentFixture<ProfessionalDashboardComponent>;
  let workerApiSpy: jasmine.SpyObj<WorkerApiService>;
  let reviewApiSpy: jasmine.SpyObj<ReviewApiService>;

  beforeEach(async () => {
    workerApiSpy = jasmine.createSpyObj('WorkerApiService', ['getWorkers']);
    reviewApiSpy = jasmine.createSpyObj('ReviewApiService', ['getReviews']);

    workerApiSpy.getWorkers.and.returnValue(of([
      { id: 1, name: 'A', specialization: 'Stylist', photoUrl: 'a.jpg', providerId: 1 },
      { id: 2, name: 'B', specialization: 'Barber', photoUrl: 'b.jpg', providerId: 2 },
      { id: 3, name: 'C', specialization: 'Colorist', photoUrl: 'c.jpg', providerId: 2 }
    ]));
    reviewApiSpy.getReviews.and.returnValue(of([]));

    TestBed.overrideComponent(ProfessionalDashboardComponent, {
      set: {
        imports: [StaffListComponent, TranslateModule],
        template: '<app-staff-list [WorkerList]="worker"></app-staff-list>'
      }
    });

    await TestBed.configureTestingModule({
      imports: [ProfessionalDashboardComponent, TranslateModule.forRoot()],
      providers: [
        { provide: WorkerApiService, useValue: workerApiSpy },
        { provide: ReviewApiService, useValue: reviewApiSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfessionalDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should load provider workers and render them via staff list/items', () => {
    spyOn(localStorage, 'getItem').and.returnValue('2');

    component.ngOnInit();
    fixture.detectChanges();

    const staffItems = fixture.nativeElement.querySelectorAll('app-staff-item');

    expect(component.worker.length).toBe(2);
    expect(staffItems.length).toBe(2);
  });
});
