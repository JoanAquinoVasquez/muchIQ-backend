import { Module } from '@nestjs/common';
import { SystemModulesService } from '../../application/system-modules/system-modules.service';
import { SystemModulesController } from './system-modules.controller';
import { PrismaSystemModuleRepository } from './prisma-system-modules.repository';
import { ISystemModuleRepository } from '../../domain/system-modules/system-module.repository';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Module({
    providers: [
        SystemModulesService,
        PermissionsGuard,
        {
            provide: ISystemModuleRepository,
            useClass: PrismaSystemModuleRepository,
        },
    ],
    controllers: [SystemModulesController],
    exports: [SystemModulesService],
})
export class SystemModulesModule {}
