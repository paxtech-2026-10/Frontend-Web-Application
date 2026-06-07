import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SalonProfile } from '../../models/salon-profile.entity';
import { SocialSummary } from '../../models/social.entity';
import { EditImagesDialogComponent } from '../edit-images-dialog/edit-images-dialog.component';
import { EditSocialsDialogComponent } from '../social-edit/social-edit.component';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.css'],
  imports: [CommonModule, MatButtonModule, MatIconModule]
})
export class ProfileHeaderComponent {
  @Input({ required: true }) profile: SalonProfile = new SalonProfile();
  @Input() socialsDetails: SocialSummary[] = [];

  constructor(private dialog: MatDialog) {}

  get initials(): string {
    return (this.profile.companyName || 'U')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }

  openEditImages(): void {
    this.dialog.open(EditImagesDialogComponent, {
      width: '440px',
      data: {
        profileId: this.profile.id,
        profileImageUrl: this.profile.profileImageUrl,
        coverImageUrl: this.profile.coverImageUrl
      }
    }).afterClosed().subscribe(updated => {
      if (!updated) return;
      this.profile.profileImageUrl = updated.profileImageUrl;
      this.profile.coverImageUrl = updated.coverImageUrl;
    });
  }

  openEditSocials(): void {
    this.dialog.open(EditSocialsDialogComponent, {
      width: '400px',
      data: {
        profileId: this.profile.id,
        socials: this.profile.socials,
        socialsDetails: this.socialsDetails
      }
    }).afterClosed().subscribe(updated => {
      if (updated) this.profile.socials = updated;
    });
  }
}
