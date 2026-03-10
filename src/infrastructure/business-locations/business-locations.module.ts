import { Module } from '@nestjs/common';
import { BusinessLocationsService } from '../../application/business-locations/business-locations.service';
import { BusinessLocationsController } from './business-locations.controller';
import { PrismaBusinessLocationRepository } from './prisma-business-locations.repository';
import { IBusinessLocationRepository } from '../../domain/commerce/business-location.repository';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CompaniesModule } from '../companies/companies.module';

@Module({
    imports: [CompaniesModule], // necesita CompaniesService para validar ownership
    providers: [
        BusinessLocationsService,
        PermissionsGuard,
        {
            provide: IBusinessLocationRepository,
            useClass: PrismaBusinessLocationRepository,
        },
    ],
    controllers: [BusinessLocationsController],
    exports: [BusinessLocationsService],
})
export class BusinessLocationsModule {}
