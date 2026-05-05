import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFavoriteComponent } from './client-favorite.component';

describe('ClientFavoriteComponent', () => {
  let component: ClientFavoriteComponent;
  let fixture: ComponentFixture<ClientFavoriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientFavoriteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientFavoriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
