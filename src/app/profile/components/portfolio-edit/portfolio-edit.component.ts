import { Component, Input } from '@angular/core';
import { PortfolioApiService } from '../../services/portfolio-api.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-portfolio-edit',
  imports: [
    FormsModule
  ],
  templateUrl: './portfolio-edit.component.html'
})
export class PortfolioEditComponent {
  @Input() providerProfileId!: number;
  @Input() imageId!: number;
  @Input() imageUrl: string = '';

  constructor(private portfolioApi: PortfolioApiService) {}

  save() {
    this.portfolioApi
      .updatePortfolioImage(this.providerProfileId, this.imageId, { imageUrl: this.imageUrl })
      .subscribe(() => alert('✅ Imagen actualizada'), err => alert('❌ Error'));
  }
}
