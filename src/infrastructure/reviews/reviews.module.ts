import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ReviewsController } from './controllers/reviews.controller';
import { ReviewsService } from '../../application/reviews/services/reviews.service';
import { PrismaReviewRepository } from './repositories/prisma-review.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ReviewsController],
  providers: [
    ReviewsService,
    {
      provide: 'IReviewRepository',
      useClass: PrismaReviewRepository,
    },
  ],
  exports: [ReviewsService],
})
export class ReviewsModule {}
