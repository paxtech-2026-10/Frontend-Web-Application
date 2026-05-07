import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {ProviderProfile} from '../../models/Salon.entity';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardImage,
  MatCardTitle
} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {ReviewListComponent} from '../review-list/review-list.component';
import {RouterLink} from '@angular/router';
import {Review} from '../../../reviews/models/review.entity';
import {ReviewApiService} from '../../../reviews/services/review-api.service';
import {ReviewAssembler} from '../../../reviews/services/review.assembler';
import {TranslatePipe} from '@ngx-translate/core';


@Component({
  selector: 'app-salon-item',
  imports: [
    MatCardTitle,
    MatCardActions,
    MatButton,
    MatCardImage,
    MatCardContent,
    MatCard,
    ReviewListComponent,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './Salon-item.component.html',
  styleUrl: './Salon-item.component.css'
})
export class SalonItemComponent implements OnInit{
  @Input() salon!: ProviderProfile;
  @Output() salonSelected = new EventEmitter<ProviderProfile>();
  private reviewService = inject(ReviewApiService)
  reviews: Review[] = [];
  reviewAverage = 0;
  constructor() { }

  get displayAddress(): string {
    return (this.salon.location ?? '')
      .replace(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/, '')
      .replace('|', '')
      .trim();
  }

  get displayDistance(): string {
    const distanceKm = this.salon.distanceKm;

    if (distanceKm === undefined || distanceKm === Number.MAX_VALUE) {
      return 'Distance unavailable';
    }

    if (distanceKm < 0.1) {
      return '< 100 m';
    }

    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)} m`;
    }

    return `${distanceKm.toFixed(1)} km`;
  }

  ngOnInit() {
    /*
    this.reviewService.getBySalonId(this.salon.id).subscribe(reviews => {
      this.reviews = ReviewAssembler.toEntitiesFromResponse(reviews);
      this.reviews.forEach(review=> this.reviewAverage+= review.rating);
      this.reviewAverage = this.reviewAverage/this.reviews.length;
    });*/
    this.reviewService.getAll().subscribe(reviews => {
      this.reviews = ReviewAssembler.toEntitiesFromResponse(reviews).filter(review => review.salonId === this.salon.providerId);
      this.reviews.forEach(review=> this.reviewAverage+= review.rating);
      this.reviewAverage = this.reviewAverage/this.reviews.length;
    });


  }


}
