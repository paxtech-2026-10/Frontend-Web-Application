import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsItemComponent } from './appointments-item.component';

describe('AppointmentsItemComponent', () => {
  let component: AppointmentsItemComponent;
  let fixture: ComponentFixture<AppointmentsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentsItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
