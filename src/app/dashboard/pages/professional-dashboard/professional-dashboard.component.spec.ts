import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ProfessionalDashboardComponent } from './professional-dashboard.component';
import { WorkerApiService } from '../../services/worker-api.service';
import { ReviewApiService } from '../../../reviews/services/review-api.service';

describe('ProfessionalDashboardComponent', () => {
  let component: ProfessionalDashboardComponent;
  let fixture: ComponentFixture<ProfessionalDashboardComponent>;
  let workerApiSpy: jasmine.SpyObj<WorkerApiService>;
  let reviewApiSpy: jasmine.SpyObj<ReviewApiService>;

  beforeEach(async () => {
    workerApiSpy = jasmine.createSpyObj('WorkerApiService', ['getWorkers']);
    reviewApiSpy = jasmine.createSpyObj('ReviewApiService', ['getReviews']);
    workerApiSpy.getWorkers.and.returnValue(of([]));
    reviewApiSpy.getReviews.and.returnValue(of([]));

    TestBed.overrideComponent(ProfessionalDashboardComponent, {
      set: {
        imports: [],
        template: '<div></div>'
      }
    });

    await TestBed.configureTestingModule({
      imports: [ProfessionalDashboardComponent],
      providers: [
        { provide: WorkerApiService, useValue: workerApiSpy },
        { provide: ReviewApiService, useValue: reviewApiSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionalDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not load workers when providerId does not exist', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const warnSpy = spyOn(console, 'warn');

    component.ngOnInit();

    expect(workerApiSpy.getWorkers).not.toHaveBeenCalled();
    expect(reviewApiSpy.getReviews).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
  });

  it('should filter workers by providerId', () => {
    spyOn(localStorage, 'getItem').and.returnValue('2');
    workerApiSpy.getWorkers.and.returnValue(of([
      { id: 1, name: 'A', specialization: 'Stylist', photoUrl: 'a.jpg', providerId: 1 },
      { id: 2, name: 'B', specialization: 'Barber', photoUrl: 'b.jpg', providerId: 2 }
    ]));
    reviewApiSpy.getReviews.and.returnValue(of([
      { id: 1, author: 'Ana', rating: 5, text: 'ok', read: false, salonId: 2 },
      { id: 2, author: 'Luis', rating: 3, text: 'meh', read: false, salonId: 1 }
    ]));

    component.ngOnInit();

    expect(component.worker.length).toBe(1);
    expect(component.worker[0].providerId).toBe(2);
    expect(component.reviews.length).toBe(1);
    expect(component.reviews[0].salonId).toBe(2);
  });
});
