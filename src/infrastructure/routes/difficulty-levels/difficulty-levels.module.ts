import { Module } from '@nestjs/common';
import { DifficultyLevelsService } from '../../../application/routes/difficulty-levels/services/difficulty-levels.service';
import { DifficultyLevelsController } from '../../../application/routes/difficulty-levels/controllers/difficulty-levels.controller';
import { PrismaDifficultyLevelRepository } from './repositories/prisma-difficulty-level.repository';
import { IDifficultyLevelRepository } from '../../../domain/routes/interfaces/difficulty-level.repository.interface';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DifficultyLevelsController],
  providers: [
    DifficultyLevelsService,
    {
      provide: IDifficultyLevelRepository,
      useClass: PrismaDifficultyLevelRepository,
    },
  ],
  exports: [DifficultyLevelsService],
})
export class DifficultyLevelsModule {}
