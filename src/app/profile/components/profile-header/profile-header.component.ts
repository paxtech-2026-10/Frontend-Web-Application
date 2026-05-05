import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { SalonProfile } from '../../models/salon-profile.entity';
import {SocialSummary} from '../../models/social.entity';
import {EditSocialsDialogComponent} from '../social-edit/social-edit.component';
import {CommonModule} from '@angular/common';


@Component({
  selector: 'app-profile-header',
  standalone: true,
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.css'],
  imports: [MatIconModule, MatButtonModule, CommonModule]
})
export class ProfileHeaderComponent {

  @Input({ required: true }) profile!: SalonProfile;
  /** redes completas, opcionalmente precargadas */
  @Input() socialsDetails: SocialSummary[] = [];

  constructor(private dialog: MatDialog) {}

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
