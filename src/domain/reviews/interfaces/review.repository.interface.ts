import { ReviewEntity } from '../entities/review.entity';

export interface PaginatedReviews {
  data: ReviewEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  averageRating?: number;
}

export interface IReviewRepository {
  create(review: ReviewEntity): Promise<ReviewEntity>;
  findById(id: string): Promise<ReviewEntity | null>;
  findAll(page: number, limit: number, filters?: any): Promise<PaginatedReviews>;
  update(id: string, review: Partial<ReviewEntity>): Promise<ReviewEntity>;
  delete(id: string): Promise<void>;
  getAverageRating(targetId: string, isPlace: boolean): Promise<number>;
}
