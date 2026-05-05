import { Review } from '../models/review.entity';
import { ReviewResponse } from './review.response';

export class ReviewAssembler {
  static toEntityFromResource(resource: ReviewResponse): Review {
    return {
      id: resource.id,
      author: resource.author,
      rating: resource.rating,
      text: resource.review,
      read: resource.read,
      salonId: resource.providerId
    };
  }

  static toEntitiesFromResponse(resources: ReviewResponse[]): Review[] {
    return resources.map(this.toEntityFromResource);
  }
}
