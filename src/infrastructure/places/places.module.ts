import { Module } from '@nestjs/common';
import { PlacesService } from '../../application/places/places.service';
import { PlacesController } from './places.controller';
import { PrismaPlaceRepository } from './prisma-places.repository';
import { IPlaceRepository } from '../../domain/places/place.repository';

@Module({
    providers: [
        PlacesService,
        {
            provide: IPlaceRepository,
            useClass: PrismaPlaceRepository,
        },
    ],
    controllers: [PlacesController],
    exports: [PlacesService],
})
export class PlacesModule { }
