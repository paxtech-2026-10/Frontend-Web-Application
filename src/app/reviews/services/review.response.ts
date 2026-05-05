export interface ReviewResponse {
  id?: number ;
  author: string;
  rating: number;
  review: string;
  read: boolean;
  providerId: number;
}
