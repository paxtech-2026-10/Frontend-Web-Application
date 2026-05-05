import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarProviderComponent } from './toolbar-provider.component';

describe('ToolbarProviderComponent', () => {
  let component: ToolbarProviderComponent;
  let fixture: ComponentFixture<ToolbarProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarProviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
