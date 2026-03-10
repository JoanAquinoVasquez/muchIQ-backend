import { Module } from '@nestjs/common';
import { RoleModulesService } from '../../application/role-modules/role-modules.service';
import { RoleModulesController } from './role-modules.controller';
import { PrismaRoleModuleRepository } from './prisma-role-modules.repository';
import { IRoleModuleRepository } from '../../domain/role-modules/role-module.repository';
import { IRoleRepository } from '../../domain/roles/role.repository';
import { PrismaRoleRepository } from '../roles/prisma-roles.repository';
import { ISystemModuleRepository } from '../../domain/system-modules/system-module.repository';
import { PrismaSystemModuleRepository } from '../system-modules/prisma-system-modules.repository';
import { IPermissionActionRepository } from '../../domain/permissions/permission-action.repository';
import { PrismaPermissionActionRepository } from '../permissions/prisma-permissions.repository';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Module({
    providers: [
        RoleModulesService,
        PermissionsGuard,
        { provide: IRoleModuleRepository, useClass: PrismaRoleModuleRepository },
        { provide: IRoleRepository, useClass: PrismaRoleRepository },
        { provide: ISystemModuleRepository, useClass: PrismaSystemModuleRepository },
        { provide: IPermissionActionRepository, useClass: PrismaPermissionActionRepository },
    ],
    controllers: [RoleModulesController],
    exports: [RoleModulesService],
})
export class RoleModulesModule {}
