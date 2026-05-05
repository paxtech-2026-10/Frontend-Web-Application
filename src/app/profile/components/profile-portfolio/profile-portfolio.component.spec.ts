import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePortfolioComponent } from './profile-portfolio.component';

describe('ProfilePortfolioComponent', () => {
  let component: ProfilePortfolioComponent;
  let fixture: ComponentFixture<ProfilePortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePortfolioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilePortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
