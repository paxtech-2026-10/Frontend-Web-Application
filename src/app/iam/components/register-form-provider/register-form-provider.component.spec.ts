import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFormProviderComponent } from './register-form-provider.component';

describe('RegisterFormProviderComponent', () => {
  let component: RegisterFormProviderComponent;
  let fixture: ComponentFixture<RegisterFormProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFormProviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterFormProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
