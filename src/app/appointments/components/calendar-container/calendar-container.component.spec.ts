import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekCalendarComponent } from './calendar-container.component';

describe('CalendarContainerComponent', () => {
  let component: WeekCalendarComponent;
  let fixture: ComponentFixture<WeekCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
