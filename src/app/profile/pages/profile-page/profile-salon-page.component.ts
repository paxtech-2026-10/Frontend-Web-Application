import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { ProfileHeaderComponent } from '../../components/profile-header/profile-header.component';
import { ProfilePortfolioComponent } from '../../components/profile-portfolio/profile-portfolio.component';
import { ReviewListComponent } from '../../components/review-list/review-list.component';
import { SalonProfile } from '../../models/salon-profile.entity';
import { SalonProfileApiService } from '../../services/salon-profile-api.service';

@Component({
  selector: 'app-profile-page',
  imports: [
    NgIf,
    MatIcon,
    MatProgressSpinner,
    ProfileHeaderComponent,
    ProfilePortfolioComponent,
    ReviewListComponent,
    TranslatePipe
  ],
  templateUrl: './profile-salon-page.component.html',
  styleUrl: './profile-salon-page.component.css'
})
export class ProfileSalonPageComponent implements OnInit {
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
        this.errorMessage = err?.message ?? 'No pudimos cargar tu perfil.';
        this.isLoading = false;
      }
    });
  }
}
