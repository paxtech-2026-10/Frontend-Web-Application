import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { StaffItemComponent } from './staff-item.component';
import { Worker } from '../../models/worker.entity';

describe('StaffItemComponent', () => {
  let component: StaffItemComponent;
  let fixture: ComponentFixture<StaffItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffItemComponent, TranslateModule.forRoot()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render worker name, specialization and image', () => {
    const worker: Worker = {
      id: 1,
      name: 'Sofia',
      specialization: 'Stylist',
      photoUrl: 'https://example.com/sofia.jpg',
      providerId: 7
    };

    component.worker = worker;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.staff-name')?.textContent).toContain('Sofia');
    expect(compiled.querySelector('.staff-role')?.textContent).toContain('Stylist');
    expect((compiled.querySelector('.staff-image') as HTMLImageElement).src).toContain(worker.photoUrl);
  });
});
