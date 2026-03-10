import {
    Injectable,
    Inject,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { RoleModule, RoleModulePermission } from '../../domain/role-modules/role-module.entity';
import { IRoleModuleRepository } from '../../domain/role-modules/role-module.repository';
import { IRoleRepository } from '../../domain/roles/role.repository';
import { ISystemModuleRepository } from '../../domain/system-modules/system-module.repository';
import { IPermissionActionRepository } from '../../domain/permissions/permission-action.repository';

@Injectable()
export class RoleModulesService {
    constructor(
        @Inject(IRoleModuleRepository)
        private readonly roleModuleRepo: IRoleModuleRepository,
        @Inject(IRoleRepository)
        private readonly roleRepo: IRoleRepository,
        @Inject(ISystemModuleRepository)
        private readonly moduleRepo: ISystemModuleRepository,
        @Inject(IPermissionActionRepository)
        private readonly permRepo: IPermissionActionRepository,
    ) {}

    async getModulesByRole(roleId: string): Promise<RoleModule[]> {
        const role = await this.roleRepo.findById(roleId);
        if (!role) throw new NotFoundException(`Rol '${roleId}' no encontrado`);
        return this.roleModuleRepo.findByRoleId(roleId);
    }

    async assignModule(roleId: string, moduleId: string): Promise<RoleModule> {
        const [role, mod] = await Promise.all([
            this.roleRepo.findById(roleId),
            this.moduleRepo.findById(moduleId),
        ]);
        if (!role) throw new NotFoundException(`Rol '${roleId}' no encontrado`);
        if (!mod) throw new NotFoundException(`Módulo '${moduleId}' no encontrado`);

        const existing = await this.roleModuleRepo.findRoleModule(roleId, moduleId);
        if (existing) throw new ConflictException('Este módulo ya está asignado al rol');

        return this.roleModuleRepo.assignModule(roleId, moduleId);
    }

    async removeModule(roleId: string, moduleId: string): Promise<void> {
        const existing = await this.roleModuleRepo.findRoleModule(roleId, moduleId);
        if (!existing) throw new NotFoundException('No existe esa asignación de módulo al rol');
        return this.roleModuleRepo.removeModule(roleId, moduleId);
    }

    async assignPermission(
        roleId: string,
        moduleId: string,
        permissionActionId: string,
    ): Promise<RoleModulePermission> {
        const roleModule = await this.roleModuleRepo.findRoleModule(roleId, moduleId);
        if (!roleModule) throw new NotFoundException('El módulo no está asignado a este rol');

        const perm = await this.permRepo.findById(permissionActionId);
        if (!perm) throw new NotFoundException(`Acción de permiso '${permissionActionId}' no encontrada`);

        return this.roleModuleRepo.assignPermission(roleModule.id, permissionActionId);
    }

    async removePermission(
        roleId: string,
        moduleId: string,
        permissionActionId: string,
    ): Promise<void> {
        const roleModule = await this.roleModuleRepo.findRoleModule(roleId, moduleId);
        if (!roleModule) throw new NotFoundException('El módulo no está asignado a este rol');
        return this.roleModuleRepo.removePermission(roleModule.id, permissionActionId);
    }

    // Reemplaza todos los permisos de un rol+módulo en una sola operación
    async syncPermissions(
        roleId: string,
        moduleId: string,
        permissionActionIds: string[],
    ): Promise<RoleModule> {
        const roleModule = await this.roleModuleRepo.findRoleModule(roleId, moduleId);
        if (!roleModule) throw new NotFoundException('El módulo no está asignado a este rol');
        return this.roleModuleRepo.syncPermissions(roleModule.id, permissionActionIds);
    }
}
