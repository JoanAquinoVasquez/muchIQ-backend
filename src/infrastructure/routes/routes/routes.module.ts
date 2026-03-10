import { Module } from '@nestjs/common';
import { RoutesService } from '../../../application/routes/routes/services/routes.service';
import { RoutesController } from '../../../application/routes/routes/controllers/routes.controller';
import { PrismaRouteRepository } from './repositories/prisma-route.repository';
import { IRouteRepository } from '../../../domain/routes/interfaces/route.repository.interface';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RoutesController],
  providers: [
    RoutesService,
    {
      provide: IRouteRepository,
      useClass: PrismaRouteRepository,
    },
  ],
  exports: [RoutesService],
})
export class RoutesModule {}
