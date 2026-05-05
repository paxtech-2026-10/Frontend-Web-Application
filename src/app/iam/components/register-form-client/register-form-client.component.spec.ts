import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFormClientComponent } from './register-form-client.component';

describe('RegisterFormClientComponent', () => {
  let component: RegisterFormClientComponent;
  let fixture: ComponentFixture<RegisterFormClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFormClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterFormClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
