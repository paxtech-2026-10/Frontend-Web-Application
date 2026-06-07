import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SalonProfile } from '../../../profile/models/salon-profile.entity';
import { SalonProfileApiService } from '../../../profile/services/salon-profile-api.service';
import { SettingsComponent } from '../../components/settings/settings.component';
import { SettingsPasswordComponent } from '../../components/settings-password/settings-password.component';

@Component({
  selector: 'app-settings-page',
  imports: [
    NgIf,
    MatIcon,
    MatProgressSpinner,
    SettingsComponent,
    SettingsPasswordComponent
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css'
})
export class SettingsPageComponent implements OnInit {
  profile: SalonProfile = new SalonProfile();
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private profileService: SalonProfileApiService) {}

  ngOnInit(): void {
    this.profileService.getActiveProviderProfile().subscribe({
      next: profile => {
        this.profile = profile;
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = err?.message ?? 'No pudimos cargar la configuracion.';
        this.isLoading = false;
      }
    });
  }
}
