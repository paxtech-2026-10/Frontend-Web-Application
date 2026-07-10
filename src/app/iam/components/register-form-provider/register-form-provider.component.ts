import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AccountApiService, SignUpPayload, UserResource } from '../../services/accountApi.service';

import { TranslatePipe } from '@ngx-translate/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';

@Component({
  selector: 'app-register-form-provider',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
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
    private accountService: AccountApiService
  ) {
    this.registerForm = this.fb.group({
      companyName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.snackBar.open('Please fill in all fields correctly', 'Close', { duration: 3000, panelClass: 'u-snack-error' });
      return;
    }

    const payload: SignUpPayload = {
      ...this.registerForm.value,
      type: 'provider'
    };

    this.registerProvider(payload);
  }

  private registerProvider(payload: SignUpPayload): void {
    this.accountService.signUp(payload).subscribe({
      next: (user: UserResource) => {
        this.accountService.createProvider(payload.companyName, user.id).subscribe({
          next: () => {
            this.snackBar.open('Account created successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: 'u-snack-success'
            });

            setTimeout(() => this.router.navigate(['/iam/login']), 1500);
          },
          error: () => {
            this.snackBar.open('User created but failed to link as provider', 'Close', { duration: 3000, panelClass: 'u-snack-error' });
          }
        });
      },
      error: (err) => {
        // The backend rejects a duplicate email with 401 (empty body); 409/400 are
        // also treated as "email taken" so the user gets an actionable message.
        const emailTaken = err?.status === 401 || err?.status === 409 || err?.status === 400;
        const message = emailTaken
          ? 'This email is already registered. Try logging in instead.'
          : 'Something went wrong. Please try again.';
        this.snackBar.open(message, 'Close', { duration: 4000, panelClass: 'u-snack-error' });
      }
    });
  }
}
