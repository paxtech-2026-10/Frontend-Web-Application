import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialEditComponent } from './social-edit.component';

describe('SocialEditComponent', () => {
  let component: SocialEditComponent;
  let fixture: ComponentFixture<SocialEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
