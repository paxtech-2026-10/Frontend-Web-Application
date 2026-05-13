import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { StaffListComponent } from './staff-list.component';
import { Worker } from '../../models/worker.entity';

describe('StaffListComponent', () => {
  let component: StaffListComponent;
  let fixture: ComponentFixture<StaffListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffListComponent, TranslateModule.forRoot()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render one staff item per worker', () => {
    const workers: Worker[] = [
      {
        id: 1,
        name: 'Diego',
        specialization: 'Barber',
        photoUrl: 'https://example.com/diego.jpg',
        providerId: 2
      },
      {
        id: 2,
        name: 'Paula',
        specialization: 'Makeup',
        photoUrl: 'https://example.com/paula.jpg',
        providerId: 2
      }
    ];

    component.WorkerList = workers;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const staffItems = compiled.querySelectorAll('app-staff-item');
    expect(staffItems.length).toBe(2);
  });
});
