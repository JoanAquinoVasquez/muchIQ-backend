import { Module } from '@nestjs/common';
import { DishesController } from './dishes.controller';
import { DishesService } from '../../application/dishes/dishes.service';
import { PrismaDishesRepository } from './prisma-dishes.repository';
import { IDishRepository } from '../../domain/dishes/dish.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DishesController],
  providers: [
    DishesService,
    {
      provide: IDishRepository,
      useClass: PrismaDishesRepository,
    },
  ],
  exports: [DishesService],
})
export class DishesModule {}
