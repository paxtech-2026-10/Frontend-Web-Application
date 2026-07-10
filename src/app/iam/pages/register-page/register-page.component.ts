import { Component } from '@angular/core';
import { RegisterFormClientComponent } from '../../components/register-form-client/register-form-client.component';
import { RegisterFormProviderComponent } from '../../components/register-form-provider/register-form-provider.component';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { trigger, transition, query, style, animate, group } from '@angular/animations';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    RegisterFormClientComponent,
    RegisterFormProviderComponent,
    FormsModule,
    NgIf,
    TranslatePipe,
    MatButtonToggleModule
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
  animations: [
    // Exactamente la misma animación que el cambio login<->register (routeFade en iam-layout).
    // El escenario (.register-container) tiene altura fija, igual que .iam-outlet, así que
    // Client y Provider ocupan el mismo espacio y solo hacen crossfade, sin saltos.
    trigger('formSwap', [
      transition('* <=> *', [
        query(':enter, :leave', [
          style({ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' })
        ], { optional: true }),
        query(':enter', [style({ opacity: 0, transform: 'translateY(12px)' })], { optional: true }),
        group([
          query(':leave', [
            animate('130ms ease', style({ opacity: 0, transform: 'translateY(-8px)' }))
          ], { optional: true }),
          query(':enter', [
            animate('260ms 90ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ], { optional: true }),
        ]),
      ]),
    ]),
  ],
})
export class RegisterPageComponent {
  isProvider = false;

  toggleForm(value: boolean) {
    this.isProvider = value;
  }
}
