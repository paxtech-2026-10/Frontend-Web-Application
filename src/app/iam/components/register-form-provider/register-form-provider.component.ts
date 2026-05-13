import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AccountApiService, SignUpPayload, UserResource } from '../../services/accountApi.service';

import { TranslatePipe } from '@ngx-translate/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import { GeocodingService } from '../../../shared/services/geocoding.service';

@Component({
  selector: 'app-register-form-provider',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatLabel,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './register-form-provider.component.html',
  styleUrl: './register-form-provider.component.css'
})
export class RegisterFormProviderComponent {
  registerForm: FormGroup;
  isProvider: boolean = true;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private accountService: AccountApiService,
    private geocodingService: GeocodingService
  ) {
    this.registerForm = this.fb.group({
      companyName: ['', Validators.required],
      location: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.snackBar.open('Please fill in all fields correctly', 'Close', { duration: 3000 });
      return;
    }

    const payload: SignUpPayload = {
      ...this.registerForm.value,
      type: 'provider'
    };

    this.geocodingService.geocodeAddress(payload.location ?? '').subscribe({
      next: geocodedLocation => this.registerProvider(payload, geocodedLocation),
      error: () => {
        this.snackBar.open('Address could not be located. Try a more specific address.', 'Close', { duration: 3000 });
      }
    });
  }

  private registerProvider(payload: SignUpPayload, geocodedLocation: string): void {
    this.accountService.signUp(payload).subscribe({
      next: (user: UserResource) => {
        this.accountService.createProvider(payload.companyName, user.id).subscribe({
          next: (provider: { id: number }) => {
            this.accountService.getProviderProfileByProviderId(provider.id).subscribe({
              next: (profile: { id: number }) => {
                this.accountService.updateProviderProfile(profile.id, {
                  companyName: payload.companyName,
                  location: geocodedLocation
                }).subscribe({
                  next: () => {
                    this.snackBar.open('Account created successfully!', 'Close', {
                      duration: 3000,
                      horizontalPosition: 'center',
                      verticalPosition: 'top'
                    });

                    setTimeout(() => this.router.navigate(['/iam/login']), 1500);
                  },
                  error: () => {
                    this.snackBar.open('Provider created but failed to save address', 'Close', { duration: 3000 });
                  }
                });
              },
              error: () => {
                this.snackBar.open('Provider created but profile could not be loaded', 'Close', { duration: 3000 });
              }
            });
          },
          error: () => {
            this.snackBar.open('User created but failed to link as provider', 'Close', { duration: 3000 });
          }
        });
      },
      error: () => {
        this.snackBar.open('Something went wrong. Try again.', 'Close', { duration: 3000 });
      }
    });
  }
}
