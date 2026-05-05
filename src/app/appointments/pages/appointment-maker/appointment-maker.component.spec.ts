import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentMakerComponent } from './appointment-maker.component';

describe('AppointmentMakerComponent', () => {
  let component: AppointmentMakerComponent;
  let fixture: ComponentFixture<AppointmentMakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentMakerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
