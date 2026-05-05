import {Component, Input} from '@angular/core';
import {SalonProfile} from '../../../profile/models/salon-profile.entity';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  @Input() profile!: SalonProfile;
}
