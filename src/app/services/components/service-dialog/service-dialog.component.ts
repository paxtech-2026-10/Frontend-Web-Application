import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceResponse } from '../../services/service.response';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatFormField } from "@angular/material/form-field";
import { MatInput, MatLabel } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatDialogContent, MatDialogActions, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-create-service-dialog',
  standalone: true,
  templateUrl: './service-dialog.component.html',
  imports: [
    CommonModule,
    FormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatOption,
    MatSelect,
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle,
    MatLabel
  ]
})
export class CreateServiceDialogComponent {
  service: ServiceResponse = {
    id: 0,
    name: '',
    duration: 0,
    price: 0,
    providerId: 0
  };

  submitted = false;

  constructor(
    public dialogRef: MatDialogRef<CreateServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ServiceResponse | null
  ) {
    if (data) {
      this.service = { ...data }; // ← edición
    } else {
      const providerId = localStorage.getItem('providerId');
      if (providerId) {
        this.service.providerId = parseInt(providerId, 10);
      } else {
        console.warn('No se encontró providerId en localStorage.');
      }
    }
  }

  get nameError(): string | null {
    if (!this.submitted) return null;
    return !this.service.name?.trim() ? 'El nombre es requerido' : null;
  }

  get durationError(): string | null {
    if (!this.submitted) return null;
    if (this.service.duration === null || this.service.duration === undefined) {
      return 'La duración es requerida';
    }
    return this.service.duration <= 0 ? 'La duración debe ser mayor a 0 minutos' : null;
  }

  get priceError(): string | null {
    if (!this.submitted) return null;
    if (this.service.price === null || this.service.price === undefined) {
      return 'El precio es requerido';
    }
    return this.service.price < 0 ? 'El precio no puede ser negativo' : null;
  }

  submit() {
    this.submitted = true;
    if (this.nameError || this.durationError || this.priceError) {
      return;
    }
    this.dialogRef.close(this.service);
  }

  cancel() {
    this.dialogRef.close();
  }
}
