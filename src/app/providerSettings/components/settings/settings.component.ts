import {Component, Input} from '@angular/core';
import {SalonProfile} from '../../../profile/models/salon-profile.entity';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  imports: [TranslatePipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  @Input() profile: SalonProfile = new SalonProfile();

  /** La ubicación puede venir como "direccion|lat,lon"; muestra solo la parte legible. */
  get displayLocation(): string {
    return (this.profile.location || '').split('|')[0].trim();
  }
}
