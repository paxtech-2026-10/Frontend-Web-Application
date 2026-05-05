import {Component, OnInit} from '@angular/core';
import {SalonProfile} from '../../../profile/models/salon-profile.entity';
import {SalonProfileApiService} from '../../../profile/services/salon-profile-api.service';
import {SettingsComponent} from '../../components/settings/settings.component';
import {SettingsPasswordComponent} from '../../components/settings-password/settings-password.component';

@Component({
  selector: 'app-settings-page',
  imports: [
    SettingsComponent,
    SettingsPasswordComponent
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css'
})
export class SettingsPageComponent implements OnInit {

  profile!: SalonProfile;

  constructor(private profileService: SalonProfileApiService) {}

  ngOnInit() {
    this.profileService.getProfileById(1).subscribe(profile => {
      console.log('Perfil cargado:', profile); // 👈 Asegúrate que esto muestra algo
      this.profile = profile;
    });
  }



}
