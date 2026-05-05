import {Component, Input, OnInit} from '@angular/core';
import { Review } from '../../../reviews/models/review.entity';
import { ReviewItemComponent } from '../review-item/review-item.component';
import { CommonModule } from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, ReviewItemComponent, TranslatePipe],
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit{
  @Input() reviews: Review[] = [];
  @Input() average: number = 0;

  ngOnInit() {
    console.log(this.reviews);
    console.log(this.average);

  }


}
