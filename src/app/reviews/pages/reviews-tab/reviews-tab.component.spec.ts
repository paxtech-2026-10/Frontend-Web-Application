import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { ReviewsTabComponent } from './reviews-tab.component';
import { ReviewApiService } from '../../services/review-api.service';
import { ReviewListComponent } from '../../../dashboard/components/review-list/review-list.component';

describe('ReviewsTabComponent reviews integration', () => {

  let component: ReviewsTabComponent;
  let fixture: ComponentFixture<ReviewsTabComponent>;
  let reviewApiSpy: jasmine.SpyObj<ReviewApiService>;

  beforeEach(async () => {

    reviewApiSpy = jasmine.createSpyObj('ReviewApiService', ['getBySalonId']);

    reviewApiSpy.getBySalonId.and.returnValue(of([
      {
        id: 1,
        author: 'Gabriel',
        rating: 5,
        review: 'Excellent service',
        read: false,
        providerId: 7
      },
      {
        id: 2,
        author: 'Maria',
        rating: 4,
        review: 'Good attention',
        read: true,
        providerId: 7
      }
    ]));

    await TestBed.configureTestingModule({
      imports: [
        ReviewsTabComponent,
        ReviewListComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: ReviewApiService, useValue: reviewApiSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewsTabComponent);
    component = fixture.componentInstance;
  });

  it('should load reviews and calculate average rating', () => {

    spyOn(localStorage, 'getItem').and.returnValue('7');

    fixture.detectChanges();

    expect(component.reviews.length).toBe(2);
    expect(component.average).toBe(4.5);

    expect(component.reviews[0].author).toBe('Gabriel');
    expect(component.reviews[1].author).toBe('Maria');
  });
});
