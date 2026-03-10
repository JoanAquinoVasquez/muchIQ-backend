import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { RewardsController } from './controllers/rewards.controller';
import { RewardsService } from '../../../application/gamification/rewards/services/rewards.service';
import { PrismaRewardRepository } from './repositories/prisma-reward.repository';

@Module({
  imports: [PrismaModule],
  controllers: [RewardsController],
  providers: [
    RewardsService,
    {
      provide: 'IRewardRepository',
      useClass: PrismaRewardRepository,
    },
  ],
  exports: [RewardsService],
})
export class GamificationRewardsModule {}
