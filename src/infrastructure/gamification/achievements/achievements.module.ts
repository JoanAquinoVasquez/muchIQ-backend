import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AchievementsController } from './controllers/achievements.controller';
import { AchievementsService } from '../../../application/gamification/achievements/services/achievements.service';
import { PrismaAchievementRepository } from './repositories/prisma-achievement.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AchievementsController],
  providers: [
    AchievementsService,
    {
      provide: 'IAchievementRepository',
      useClass: PrismaAchievementRepository,
    },
  ],
  exports: [AchievementsService, 'IAchievementRepository'],
})
export class GamificationAchievementsModule {}
