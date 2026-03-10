import { Inject, Injectable } from '@nestjs/common';
import type { IReviewRepository, PaginatedReviews } from '../../../domain/reviews/interfaces/review.repository.interface';
import { ReviewEntity } from '../../../domain/reviews/entities/review.entity';
import { CreateReviewDto, UpdateReviewDto } from '../dto/review.dto';
import { InvalidRatingException, InvalidReviewTargetException, ReviewNotFoundException } from '../../../domain/reviews/exceptions/review.exception';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject('IReviewRepository')
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async create(userId: string, createDto: CreateReviewDto): Promise<ReviewEntity> {
    if (!createDto.placeId && !createDto.routeId) {
        throw new InvalidReviewTargetException();
    }
    
    if (createDto.rating < 1 || createDto.rating > 5) {
        throw new InvalidRatingException(createDto.rating);
    }

    const data = { ...createDto, userId };
    const entity = ReviewEntity.create(data);
    return this.reviewRepository.create(entity);
  }

  async findAll(page: number = 1, limit: number = 10, filters?: any): Promise<PaginatedReviews> {
    return this.reviewRepository.findAll(page, limit, filters);
  }

  async findOne(id: string): Promise<ReviewEntity> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new ReviewNotFoundException(id);
    }
    return review;
  }

  async update(id: string, updateDto: UpdateReviewDto): Promise<ReviewEntity> {
    await this.findOne(id); // Ensure exists
    
    if (updateDto.rating !== undefined && (updateDto.rating < 1 || updateDto.rating > 5)) {
        throw new InvalidRatingException(updateDto.rating);
    }

    return this.reviewRepository.update(id, updateDto as Partial<ReviewEntity>);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    return this.reviewRepository.delete(id);
  }

  async getAverageRating(targetId: string, isPlace: boolean): Promise<number> {
      return this.reviewRepository.getAverageRating(targetId, isPlace);
  }
}
