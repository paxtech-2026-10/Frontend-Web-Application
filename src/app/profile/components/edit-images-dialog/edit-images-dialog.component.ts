import {Component, Inject} from '@angular/core';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {UpdateImagesDto} from '../../models/profile.entity';
import {SalonProfileApiService} from '../../services/salon-profile-api.service';

@Component({
  selector: 'app-edit-images-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogModule,
    MatFormField,
    MatInput,
    FormsModule,
    MatButton
  ],
  template: `
    <h1 mat-dialog-title>Editar imágenes</h1>
    <div mat-dialog-content class="space-y-4">
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>URL foto de perfil</mat-label>
        <input matInput [(ngModel)]="form.profileImageUrl">
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full">
        <mat-label>URL portada</mat-label>
        <input matInput [(ngModel)]="form.coverImageUrl">
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()">Guardar</button>
    </div>`

})
export class EditImagesDialogComponent {

  form: UpdateImagesDto;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { profileId: number; profileImageUrl: string; coverImageUrl: string },
    private api: SalonProfileApiService,
    private ref: MatDialogRef<EditImagesDialogComponent>
  ) {
    this.form = {
      profileImageUrl: data.profileImageUrl,
      coverImageUrl:   data.coverImageUrl
    };
  }

  save(): void {
    this.api.updateImages( this.form).subscribe({
      next: () => this.ref.close(this.form),
      error: err => alert('❌ No se pudieron guardar los cambios: ' + err.message)
    });
  }
}
