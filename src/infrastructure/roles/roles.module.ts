import { Module } from '@nestjs/common';
import { RolesService } from '../../application/roles/roles.service';
import { RolesController } from './roles.controller';
import { PrismaRoleRepository } from './prisma-roles.repository';
import { IRoleRepository } from '../../domain/roles/role.repository';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

// PermissionsGuard solo necesita Reflector (global) y PrismaService (global @Global())
// por eso no hace falta importar AuthModule aquí
@Module({
    providers: [
        RolesService,
        PermissionsGuard,
        {
            provide: IRoleRepository,
            useClass: PrismaRoleRepository,
        },
    ],
    controllers: [RolesController],
    exports: [RolesService],
})
export class RolesModule {}
