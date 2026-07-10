import {Component, OnInit} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import { Review } from '../../models/review.entity';
import {ReviewApiService} from '../../services/review-api.service';
import {ReviewListComponent} from '../../../dashboard/components/review-list/review-list.component';
import {ReviewAssembler} from '../../services/review.assembler';

@Component({
  selector: 'app-reviews-tab',
  imports: [
    TranslatePipe,
    ReviewListComponent
  ],
  templateUrl: './reviews-tab.component.html',
  styleUrl: './reviews-tab.component.css'
})
export class ReviewsTabComponent implements OnInit{
  reviews: Review[] = [];
  average = 0;
  constructor(private reviewService: ReviewApiService) {
  }
  ngOnInit() {
    const providerId = Number(localStorage.getItem('providerId'));
    this.reviewService.getBySalonId(providerId).subscribe(resource => {
      this.reviews = ReviewAssembler.toEntitiesFromResponse(resource).filter(review => review.salonId == providerId);
      // Evitar división por cero (0/0 = NaN) cuando aún no hay reseñas
      if (this.reviews.length > 0) {
        const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
        this.average = Math.round((sum / this.reviews.length) * 10) / 10;
      } else {
        this.average = 0;
      }
    })

  }
}
