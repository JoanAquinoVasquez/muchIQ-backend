import { Module } from '@nestjs/common';
import { PermissionsService } from '../../application/permissions/permissions.service';
import { PermissionsController } from './permissions.controller';
import { PrismaPermissionActionRepository } from './prisma-permissions.repository';
import { IPermissionActionRepository } from '../../domain/permissions/permission-action.repository';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Module({
    providers: [
        PermissionsService,
        PermissionsGuard,
        {
            provide: IPermissionActionRepository,
            useClass: PrismaPermissionActionRepository,
        },
    ],
    controllers: [PermissionsController],
    exports: [PermissionsService],
})
export class PermissionsModule {}
