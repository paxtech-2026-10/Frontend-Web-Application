import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditImagesDialogComponent } from './edit-images-dialog.component';

describe('EditImagesDialogComponent', () => {
  let component: EditImagesDialogComponent;
  let fixture: ComponentFixture<EditImagesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditImagesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditImagesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
