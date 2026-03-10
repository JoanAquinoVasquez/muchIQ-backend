import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MediaTypesController, MediaController } from '../../application/media/controllers/media.controller';
import { MediaService } from '../../application/media/services/media.service';
import { PrismaMediaTypeRepository, PrismaMediaRepository } from './repositories/prisma-media.repository';
import { IMediaRepository, IMediaTypeRepository } from '../../domain/media/interfaces/media.repository.interface';

@Module({
  imports: [PrismaModule],
  controllers: [MediaTypesController, MediaController],
  providers: [
    MediaService,
    {
      provide: IMediaTypeRepository,
      useClass: PrismaMediaTypeRepository,
    },
    {
      provide: IMediaRepository,
      useClass: PrismaMediaRepository,
    },
  ],
  exports: [MediaService],
})
export class MediaModule {}
