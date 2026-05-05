import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonGridComponent } from './salon-grid.component';

describe('SalonGridComponent', () => {
  let component: SalonGridComponent;
  let fixture: ComponentFixture<SalonGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalonGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalonGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
