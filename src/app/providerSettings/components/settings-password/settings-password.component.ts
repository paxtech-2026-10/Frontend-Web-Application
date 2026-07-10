import { Component, Input } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { SalonProfile } from '../../../profile/models/salon-profile.entity';

@Component({
  selector: 'app-settings-password',
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    TranslatePipe
  ],
  templateUrl: './settings-password.component.html',
  styleUrl: './settings-password.component.css'
})
export class SettingsPasswordComponent {
  @Input() profile: SalonProfile = new SalonProfile();
}
