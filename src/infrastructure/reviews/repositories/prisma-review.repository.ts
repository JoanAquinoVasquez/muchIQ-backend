import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IReviewRepository, PaginatedReviews } from '../../../domain/reviews/interfaces/review.repository.interface';
import { ReviewEntity } from '../../../domain/reviews/entities/review.entity';

@Injectable()
export class PrismaReviewRepository implements IReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(record: any): ReviewEntity {
    return new ReviewEntity(
      record.id,
      record.rating,
      record.comment,
      record.userId,
      record.placeId,
      record.routeId,
      record.createdAt,
    );
  }

  async create(review: ReviewEntity): Promise<ReviewEntity> {
    const record = await this.prisma.review.create({
      data: {
        rating: review.rating,
        comment: review.comment,
        userId: review.userId,
        placeId: review.placeId,
        routeId: review.routeId,
      },
      include: {
          user: { select: { name: true, avatar: true } }
      }
    });
    return this.mapToDomain(record);
  }

  async findById(id: string): Promise<ReviewEntity | null> {
    const record = await this.prisma.review.findUnique({ where: { id } });
    return record ? this.mapToDomain(record) : null;
  }

  async findAll(page: number, limit: number, filters?: any): Promise<PaginatedReviews> {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters?.userId) where.userId = filters.userId;
    if (filters?.placeId) where.placeId = filters.placeId;
    if (filters?.routeId) where.routeId = filters.routeId;

    const [records, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, avatar: true } }
        }
      }),
      this.prisma.review.count({ where }),
    ]);

    // Optional: Include avg rating in paginated payload
    let avg = 0;
    if (filters?.placeId) {
        avg = await this.getAverageRating(filters.placeId, true);
    } else if (filters?.routeId) {
        avg = await this.getAverageRating(filters.routeId, false);
    }

    return {
      data: records.map((record) => {
          const dom = this.mapToDomain(record);
          // Attach user explicitly if needed for frontend logic, but entity doesn't strictly have it.
          // Leaving it strictly to entity representation for now.
          return dom;
      }),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      averageRating: avg > 0 ? avg : undefined
    };
  }

  async update(id: string, review: Partial<ReviewEntity>): Promise<ReviewEntity> {
    const record = await this.prisma.review.update({
      where: { id },
      data: {
        rating: review.rating,
        comment: review.comment,
      },
    });
    return this.mapToDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.review.delete({ where: { id } });
  }

  async getAverageRating(targetId: string, isPlace: boolean): Promise<number> {
    const aggregate = await this.prisma.review.aggregate({
        _avg: {
            rating: true,
        },
        where: isPlace ? { placeId: targetId } : { routeId: targetId }
    });
    return aggregate._avg.rating || 0;
  }
}
