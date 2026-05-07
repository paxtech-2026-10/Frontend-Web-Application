import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { WorkerResource } from '../../services/worker.resource';

@Component({
  selector: 'app-worker-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel
  ],
  templateUrl: './worker-dialog.component.html',
  styleUrl: './worker-dialog.component.css'
})
export class WorkerDialogComponent {
  worker: WorkerResource = {
    id: 0,
    name: '',
    specialization: '',
    photoUrl: 'https://placehold.co/120x120?text=Staff',
    providerId: 0
  };

  submitted = false;

  constructor(public dialogRef: MatDialogRef<WorkerDialogComponent>) {
    const providerId = localStorage.getItem('providerId');
    if (providerId) {
      this.worker.providerId = Number(providerId);
    }
  }

  get nameError(): string | null {
    if (!this.submitted) return null;
    return !this.worker.name?.trim() ? 'Name is required' : null;
  }

  get specializationError(): string | null {
    if (!this.submitted) return null;
    return !this.worker.specialization?.trim() ? 'Specialization is required' : null;
  }

  get photoUrlError(): string | null {
    if (!this.submitted) return null;
    return !this.worker.photoUrl?.trim() ? 'Photo URL is required' : null;
  }

  submit() {
    this.submitted = true;
    if (this.nameError || this.specializationError || this.photoUrlError) {
      return;
    }
    this.dialogRef.close(this.worker);
  }

  cancel() {
    this.dialogRef.close();
  }
}
