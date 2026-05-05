import {Component, inject, Input} from '@angular/core';
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {SalonProfile} from '../../../profile/models/salon-profile.entity';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {SalonProfileApiService} from '../../../profile/services/salon-profile-api.service';
import {SalonProfileAssembler} from '../../../profile/services/salon-profile.assembler';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-settings-password',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardFooter,
    MatButton,
    MatCardTitle,
    MatFormField,
    FormsModule,
    MatIcon,
    MatLabel,
    MatInputModule,
    MatIconButton
  ],
  templateUrl: './settings-password.component.html',
  styleUrl: './settings-password.component.css'
})
export class SettingsPasswordComponent {
@Input() profile!: SalonProfile;
value ='';
currentPassword = '';

private passwordService: SalonProfileApiService = inject(SalonProfileApiService)

  constructor(private snackBar: MatSnackBar) {}

  public updatePassword() {/*
    if (this.currentPassword === this.profile.accounts.passwordHash) {
      const copiedValue = { ...this.profile };
      copiedValue.accounts.passwordHash = this.value;

      const updatedResource = SalonProfileAssembler.toResponseFromEntity(copiedValue);

      this.passwordService.update(this.profile.profileId, updatedResource)
        .subscribe({
          next: () => {
            this.snackBar.open('✅ Password updated successfully!', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('❌ Failed to update password.', 'Close', { duration: 3000 });
          }
        });
    } else {
      this.snackBar.open('⚠️ Current password is incorrect.', 'Close', { duration: 3000 });
    }*/
  }


}
