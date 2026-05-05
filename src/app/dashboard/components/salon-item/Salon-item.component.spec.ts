import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonItemComponent } from './Salon-item.component';

describe('SalonItemComponent', () => {
  let component: SalonItemComponent;
  let fixture: ComponentFixture<SalonItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalonItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalonItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
