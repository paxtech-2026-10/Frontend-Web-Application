import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { forkJoin, Observable } from 'rxjs';
import {CreateSocialDto, SocialSummary} from '../../models/social.entity';
import {SocialsApiService} from '../../services/social-api.service';


@Component({
  selector: 'app-edit-socials-dialog',
  standalone: true,
  template: `
    <h1 mat-dialog-title>Editar redes sociales</h1>

    <div mat-dialog-content>
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Instagram</mat-label>
        <input matInput [(ngModel)]="form.instagram">
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full">
        <mat-label>TikTok</mat-label>
        <input matInput [(ngModel)]="form.tiktok">
      </mat-form-field>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()">Guardar</button>
    </div>
  `,
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class EditSocialsDialogComponent {

  /** Datos de entrada */
  socials: SocialSummary[] = [];
  form = { instagram: '', tiktok: '' };

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      profileId: number;
      socials: Record<string, string>;
      socialsDetails: SocialSummary[];
    },
    private socialsApi: SocialsApiService,
    private dialogRef: MatDialogRef<EditSocialsDialogComponent>
  ) {
    this.socials = data.socialsDetails ?? [];
    this.form.instagram = data.socials['instagram'] ?? '';
    this.form.tiktok    = data.socials['tiktok'] ?? '';
  }

  private find(icon: string): SocialSummary | undefined {
    return this.socials.find(s => s.socialIcon === icon);
  }

  save(): void {
    const calls: Observable<any>[] = [];
    const profileId = this.data.profileId;

    const upsert = (icon: string, url?: string) => {
      const existing = this.find(icon);
      const cleanUrl = url?.trim();

      if (cleanUrl) {
        const body: CreateSocialDto = { socialIcon: icon, socialUrl: cleanUrl };

        if (existing) { // update
          calls.push(this.socialsApi.update(profileId, existing.id, body));
        } else {        // create
          calls.push(this.socialsApi.create(profileId, body));
        }
      } else if (existing) { // delete
        calls.push(this.socialsApi.delete(profileId, existing.id));
      }
    };

    upsert('instagram', this.form.instagram);
    upsert('tiktok',    this.form.tiktok);

    forkJoin(calls).subscribe(() => {
      this.dialogRef.close({
        instagram: this.form.instagram.trim(),
        tiktok:    this.form.tiktok.trim()
      });
    });
  }
}
