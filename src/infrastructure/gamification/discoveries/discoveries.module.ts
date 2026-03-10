import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { DiscoveriesController } from './controllers/discoveries.controller';
import { DiscoveriesService } from '../../../application/gamification/discoveries/services/discoveries.service';
import { PrismaDiscoveryRepository } from './repositories/prisma-discovery.repository';

@Module({
  imports: [PrismaModule],
  controllers: [DiscoveriesController],
  providers: [
    DiscoveriesService,
    {
      provide: 'IDiscoveryRepository',
      useClass: PrismaDiscoveryRepository,
    },
  ],
  exports: [DiscoveriesService],
})
export class GamificationDiscoveriesModule {}
