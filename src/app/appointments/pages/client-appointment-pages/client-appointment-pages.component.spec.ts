import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAppointmentPagesComponent } from './client-appointment-pages.component';

describe('ClientAppointmentPagesComponent', () => {
  let component: ClientAppointmentPagesComponent;
  let fixture: ComponentFixture<ClientAppointmentPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAppointmentPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientAppointmentPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
