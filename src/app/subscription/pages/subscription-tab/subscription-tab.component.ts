import { Component } from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {SubscriptionPlanComponent} from '../../components/subscription-plan/subscription-plan.component';

@Component({
  selector: 'app-subscription-tab',
  imports: [
    TranslatePipe,
    SubscriptionPlanComponent
  ],
  templateUrl: './subscription-tab.component.html',
  styleUrl: './subscription-tab.component.css'
})
export class SubscriptionTabComponent {

}
