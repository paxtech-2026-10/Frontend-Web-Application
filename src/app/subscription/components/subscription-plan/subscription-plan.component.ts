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

  changePlan(plan: string): void {
    if (confirm('Are you sure you want to change your subscription plan?\n' +
      'This action will update your benefits, and the new plan will take effect immediately.')) {
      this.selectedPlan = plan;
    }
  }

}
