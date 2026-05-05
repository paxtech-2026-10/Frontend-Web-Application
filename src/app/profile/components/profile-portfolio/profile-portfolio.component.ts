import {Component, Input, inject, OnInit} from '@angular/core';
import { SalonProfile } from '../../models/salon-profile.entity';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { PortfolioImageApiService } from '../../services/portfolio-image-api.service';

import {PortfolioImage} from '../../models/portfolio-image';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-portfolio',
  templateUrl: './profile-portfolio.component.html',
  styleUrls: ['./profile-portfolio.component.css'],
  standalone: true,
  imports: [CommonModule, TranslatePipe]
})
export class ProfilePortfolioComponent implements OnInit{
  @Input() profile!: SalonProfile;
  isLoading = false;

  private portfolioService = inject(PortfolioImageApiService);
  private toastr = inject(MatSnackBar);


  ngOnInit() {
    console.log('Perfil cargado NUEVO:', this.profile.portfolioImages);
  }

  async onAddPhoto(): Promise<void> {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (event: any) => {

      const file = event.target.files[0];
      if (file) {
        this.isLoading = true;
        try {
          // 1. Subir imagen a ImgBB
          const imageUrl = await this.uploadToImgBB(file);

          // 2. Guardar en nuestro backend
          await this.saveToBackend(imageUrl);

          // 3. Actualizar vista
          this.profile.portfolioImages.push(imageUrl);

          this.toastr.open('Imagen agregada', 'OK')
        } catch (error) {
          console.error('Error:', error);
          this.toastr.open('Error al subir imagen', 'OK')
        } finally {
          this.isLoading = false;
        }
      }
    };

    input.click();
  }

  private async uploadToImgBB(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://api.imgbb.com/1/upload?key=bf0d2abb3d0754021e043dfcedb6662d', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Error al subir a ImgBB');
    }

    const data = await response.json();
    return data.data.url;
  }

  private async saveToBackend(imageUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.portfolioService.createPortfolioImage(1, imageUrl)
        .subscribe({
          next: () => resolve(),
          error: (err) => reject(err)
        });
    });
  }

  onImageClick(imageUrl: string): void {
    console.log('Imagen seleccionada:', imageUrl);
  }
}
