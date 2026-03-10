import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoleModule, RoleModulePermission } from '../../domain/role-modules/role-module.entity';
import { IRoleModuleRepository } from '../../domain/role-modules/role-module.repository';

const WITH_DETAILS = {
    role: { select: { id: true, name: true } },
    module: { select: { id: true, name: true, code: true } },
    permissions: {
        include: {
            permissionAction: { select: { id: true, name: true, code: true } },
        },
    },
};

@Injectable()
export class PrismaRoleModuleRepository implements IRoleModuleRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findByRoleId(roleId: string): Promise<RoleModule[]> {
        const rows = await this.prisma.roleModule.findMany({
            where: { roleId },
            include: WITH_DETAILS,
        });
        return rows.map((r) => new RoleModule(r as unknown as RoleModule));
    }

    async findRoleModule(roleId: string, moduleId: string): Promise<RoleModule | null> {
        const row = await this.prisma.roleModule.findUnique({
            where: { roleId_moduleId: { roleId, moduleId } },
            include: WITH_DETAILS,
        });
        return row ? new RoleModule(row as unknown as RoleModule) : null;
    }

    async assignModule(roleId: string, moduleId: string): Promise<RoleModule> {
        const row = await this.prisma.roleModule.create({
            data: { roleId, moduleId },
            include: WITH_DETAILS,
        });
        return new RoleModule(row as unknown as RoleModule);
    }

    async removeModule(roleId: string, moduleId: string): Promise<void> {
        await this.prisma.roleModule.delete({
            where: { roleId_moduleId: { roleId, moduleId } },
        });
    }

    async assignPermission(
        roleModuleId: string,
        permissionActionId: string,
    ): Promise<RoleModulePermission> {
        const row = await this.prisma.roleModulePermission.create({
            data: { roleModuleId, permissionActionId },
            include: {
                permissionAction: { select: { id: true, name: true, code: true } },
            },
        });
        return new RoleModulePermission(row as unknown as RoleModulePermission);
    }

    async removePermission(roleModuleId: string, permissionActionId: string): Promise<void> {
        await this.prisma.roleModulePermission.delete({
            where: {
                roleModuleId_permissionActionId: { roleModuleId, permissionActionId },
            },
        });
    }

    async syncPermissions(
        roleModuleId: string,
        permissionActionIds: string[],
    ): Promise<RoleModule> {
        // Transacción: borrar todos los permisos actuales y crear los nuevos
        await this.prisma.$transaction([
            this.prisma.roleModulePermission.deleteMany({ where: { roleModuleId } }),
            this.prisma.roleModulePermission.createMany({
                data: permissionActionIds.map((permissionActionId) => ({
                    roleModuleId,
                    permissionActionId,
                })),
                skipDuplicates: true,
            }),
        ]);

        const row = await this.prisma.roleModule.findUniqueOrThrow({
            where: { id: roleModuleId },
            include: WITH_DETAILS,
        });
        return new RoleModule(row as unknown as RoleModule);
    }
}
