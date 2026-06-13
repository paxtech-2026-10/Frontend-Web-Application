import {Component} from '@angular/core';
import {MatCard, MatCardTitle, MatCardSubtitle} from "@angular/material/card";

import {FormsModule} from '@angular/forms';

import {TranslatePipe} from '@ngx-translate/core';
import {MatIcon} from '@angular/material/icon';


@Component({
  selector: 'app-subscription-plan',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardSubtitle,
    FormsModule,
    TranslatePipe,
    MatIcon,
  ],
  templateUrl: './subscription-plan.component.html',
  styleUrl: './subscription-plan.component.css'
})
export class SubscriptionPlanComponent {
  selectedPlan: string = '';
  // Plan activo real del proveedor (idealmente vendría del backend/sesión)
  currentPlan: string = 'ProStyle';

  /** Plan que se muestra como activo en la parte superior */
  get activePlan(): string {
    return this.selectedPlan || this.currentPlan;
  }

  /** Indica si el plan recibido es el plan actualmente activo */
  isCurrentPlan(plan: string): boolean {
    return this.activePlan === plan;
  }

  changePlan(plan: string): void {
    // No permitir "cambiar" al plan que ya está activo
    if (this.isCurrentPlan(plan)) {
      return;
    }
    if (confirm('Are you sure you want to change your subscription plan?\n' +
      'This action will update your benefits, and the new plan will take effect immediately.')) {
      this.selectedPlan = plan;
    }
  }

}
