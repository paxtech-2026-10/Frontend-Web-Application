import {Component, inject, Input} from '@angular/core';
import {Review} from '../../../reviews/models/review.entity';
import { ReviewItemComponent } from '../review-item/review-item.component';
import { CommonModule } from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {ReviewResponse} from '../../../reviews/services/review.response';
import {ReviewApiService} from '../../../reviews/services/review-api.service';
import {TranslatePipe} from '@ngx-translate/core';


@Component({
  selector: 'app-review-list-client',
  standalone: true,
  imports: [CommonModule, ReviewItemComponent, MatIcon, MatIconButton, MatFormField, MatLabel, MatFormField, MatInput, MatButton, MatFormField, FormsModule, TranslatePipe],
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent {
  @Input() reviews: Review[] = [];

  setRating(rating: number): void {
    this.reviewrating = rating;
  }


  serviciodeApi: ReviewApiService = inject(ReviewApiService);

  reviewInput: string = '';
  reviewrating: number = 0;

  public postReview(): void {
    const reviewPost: ReviewResponse = {
      author: "Anonimo",
      rating: this.reviewrating,
      review: this.reviewInput,
      read: true,
      providerId: 1
    }

    this.serviciodeApi.post(reviewPost).subscribe({
      next: () =>alert('Review posted'),
      error: (e) => alert('Error posting review: ' + e.message)
    });

    this.reviewInput = '';
  }






}
