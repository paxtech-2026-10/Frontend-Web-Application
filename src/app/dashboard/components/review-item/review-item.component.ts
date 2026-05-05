import { Component, Input } from '@angular/core';
import { Review } from '../../../reviews/models/review.entity';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-item.component.html',
  styleUrls: ['./review-item.component.css']
})
export class ReviewItemComponent {
  @Input() review!: Review;

  getStars(): number[] {
    return Array(this.review.rating).fill(0);
  }
}
