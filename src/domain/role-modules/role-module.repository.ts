import { RoleModule, RoleModulePermission } from './role-module.entity';

export interface IRoleModuleRepository {
    // Obtener todos los módulos asignados a un rol
    findByRoleId(roleId: string): Promise<RoleModule[]>;
    // Asignar un módulo a un rol
    assignModule(roleId: string, moduleId: string): Promise<RoleModule>;
    // Revocar un módulo de un rol (elimina también sus permisos en cascada)
    removeModule(roleId: string, moduleId: string): Promise<void>;
    // Agregar un permiso a un rol+módulo
    assignPermission(roleModuleId: string, permissionActionId: string): Promise<RoleModulePermission>;
    // Revocar un permiso de un rol+módulo
    removePermission(roleModuleId: string, permissionActionId: string): Promise<void>;
    // Reemplazar todos los permisos de un rol+módulo de una vez
    syncPermissions(roleModuleId: string, permissionActionIds: string[]): Promise<RoleModule>;
    // Buscar asignación específica rol+módulo
    findRoleModule(roleId: string, moduleId: string): Promise<RoleModule | null>;
}

export const IRoleModuleRepository = Symbol('IRoleModuleRepository');
