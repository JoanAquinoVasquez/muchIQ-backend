import { Role } from './role.entity';

export interface RoleFilterOptions {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
}

export interface CreateRoleInput {
    name: string;
    description?: string;
    color?: string;
    isActive?: boolean;
}

export interface UpdateRoleInput {
    name?: string;
    description?: string;
    color?: string;
    isActive?: boolean;
}

export interface IRoleRepository {
    findAll(options: RoleFilterOptions): Promise<{ data: Role[]; total: number }>;
    findById(id: string): Promise<Role | null>;
    findByName(name: string): Promise<Role | null>;
    create(data: CreateRoleInput): Promise<Role>;
    update(id: string, data: UpdateRoleInput): Promise<Role>;
    // Soft delete: setea isActive = false (los roles son datos críticos del sistema)
    deactivate(id: string): Promise<Role>;
}

export const IRoleRepository = Symbol('IRoleRepository');
