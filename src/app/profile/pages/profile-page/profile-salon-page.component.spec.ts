import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSalonPageComponent } from './profile-salon-page.component';

describe('ProfilePageComponent', () => {
  let component: ProfileSalonPageComponent;
  let fixture: ComponentFixture<ProfileSalonPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileSalonPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileSalonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
