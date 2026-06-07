import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { ProfileClientService } from '../../services/profile-api.service';
import { Profile } from '../../models/profile.entity';

@Component({
  selector: 'app-profile',
  imports: [
    MatButton,
    MatError,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatProgressSpinner,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './profile-client.component.html',
  styleUrls: ['./profile-client.component.css']
})
export class ProfileClientComponent implements OnInit {
  profileForm: FormGroup;
  profile: Profile = new Profile();
  isLoading = true;
  isSaving = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileClientService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]]
    });
  }

  get initials(): string {
    const firstName = this.profileForm.get('firstName')?.value?.trim()?.[0] ?? '';
    const lastName = this.profileForm.get('lastName')?.value?.trim()?.[0] ?? '';
    return `${firstName}${lastName}`.toUpperCase() || 'U';
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.profileService.getProfile().subscribe({
      next: profile => {
        this.profile = profile;
        this.updateForm(profile);
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = err?.message ?? 'No pudimos cargar tu perfil.';
        this.isLoading = false;
      }
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid || this.isSaving) return;

    const formValue = this.profileForm.getRawValue();
    const updatedProfile: Profile = {
      ...this.profile,
      name: `${formValue.firstName.trim()} ${formValue.lastName.trim()}`,
      email: formValue.email
    };

    this.isSaving = true;
    this.profileService.updateProfile(updatedProfile).subscribe({
      next: profile => {
        this.profile = profile;
        this.updateForm(profile);
        this.isSaving = false;
        this.snackBar.open('Profile updated.', 'Close', { duration: 2500 });
      },
      error: err => {
        this.isSaving = false;
        this.snackBar.open(err?.message ?? 'Could not update profile.', 'Close', { duration: 3000 });
      }
    });
  }

  logout(): void {
    this.profileService.logout().subscribe(() => {
      this.router.navigate(['/iam/login']);
    });
  }

  private updateForm(profile: Profile): void {
    const nameParts = profile.name.trim().split(/\s+/);
    const firstName = nameParts.shift() ?? '';
    const lastName = nameParts.join(' ');

    this.profileForm.patchValue({
      firstName,
      lastName,
      email: profile.email
    });
  }
}
