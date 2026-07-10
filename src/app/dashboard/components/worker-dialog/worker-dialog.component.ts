import { CommonModule } from '@angular/common';
import { Component, Inject, Optional } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { WorkerResource } from '../../services/worker.resource';

@Component({
  selector: 'app-worker-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
    TranslatePipe
  ],
  templateUrl: './worker-dialog.component.html',
  styleUrl: './worker-dialog.component.css'
})
export class WorkerDialogComponent {
  worker: WorkerResource;
  isEdit: boolean;
  submitted = false;

  constructor(
    public dialogRef: MatDialogRef<WorkerDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) data: WorkerResource | null
  ) {
    this.isEdit = !!data;
    this.worker = data
      ? { ...data }
      : {
          id: 0,
          name: '',
          specialization: '',
          photoUrl: 'https://placehold.co/120x120?text=Staff',
          providerId: 0
        };

    if (!this.isEdit) {
      const providerId = localStorage.getItem('providerId');
      if (providerId) {
        this.worker.providerId = Number(providerId);
      }
    }
  }

  get nameError(): boolean {
    return this.submitted && !this.worker.name?.trim();
  }

  get specializationError(): boolean {
    return this.submitted && !this.worker.specialization?.trim();
  }

  get photoUrlError(): boolean {
    return this.submitted && !this.worker.photoUrl?.trim();
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
