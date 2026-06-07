import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { UpdateImagesDto } from '../../models/profile.entity';
import { SalonProfileApiService } from '../../services/salon-profile-api.service';

@Component({
  selector: 'app-edit-images-dialog',
  imports: [
    FormsModule,
    MatButton,
    MatDialogContent,
    MatDialogModule,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatProgressSpinner,
    NgIf
  ],
  template: `
    <h1 mat-dialog-title>Profile images</h1>
    <div mat-dialog-content class="dialog-content">
      <p class="hint">Paste public image URLs for your profile photo and cover.</p>

      <mat-form-field appearance="outline">
        <mat-label>Profile image URL</mat-label>
        <input matInput [(ngModel)]="form.profileImageUrl" aria-label="Profile image URL">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Cover image URL</mat-label>
        <input matInput [(ngModel)]="form.coverImageUrl" aria-label="Cover image URL">
      </mat-form-field>

      <p *ngIf="errorMessage" class="error" role="alert">{{ errorMessage }}</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button type="button" mat-dialog-close [disabled]="isSaving">Cancel</button>
      <button mat-flat-button color="primary" type="button" (click)="save()" [disabled]="isSaving">
        <mat-spinner *ngIf="isSaving" diameter="18"></mat-spinner>
        <span>{{ isSaving ? 'Saving...' : 'Save' }}</span>
      </button>
    </div>`,
  styles: [`
    .dialog-content {
      display: grid;
      gap: 0.75rem;
      min-width: min(360px, 80vw);
    }

    .hint {
      margin: 0;
      color: #667085;
    }

    .error {
      margin: 0;
      color: #b42318;
    }

    button[mat-flat-button] {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
  `]
})
export class EditImagesDialogComponent {
  form: UpdateImagesDto;
  isSaving = false;
  errorMessage: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { profileId: number; profileImageUrl: string; coverImageUrl: string },
    private api: SalonProfileApiService,
    private ref: MatDialogRef<EditImagesDialogComponent>
  ) {
    this.form = {
      profileImageUrl: data?.profileImageUrl ?? '',
      coverImageUrl: data?.coverImageUrl ?? ''
    };
  }

  save(): void {
    if (!this.data?.profileId || this.isSaving) return;

    this.isSaving = true;
    this.errorMessage = null;
    this.api.updateImages(this.data.profileId, this.form).subscribe({
      next: profile => {
        this.isSaving = false;
        this.ref.close({
          profileImageUrl: profile.profileImageUrl,
          coverImageUrl: profile.coverImageUrl
        });
      },
      error: err => {
        this.isSaving = false;
        this.errorMessage = err?.message ?? 'Could not save image URLs.';
      }
    });
  }
}
