import { SystemModule } from './system-module.entity';

export interface SystemModuleFilterOptions {
    search?: string;
    isActive?: boolean;
    parentId?: string | null;   // null = solo raíces, undefined = todos
    page?: number;
    limit?: number;
}

export interface CreateSystemModuleInput {
    name: string;
    code: string;
    description?: string;
    icon?: string;
    path?: string;
    isActive?: boolean;
    order?: number;
    parentId?: string;
}

export interface UpdateSystemModuleInput {
    name?: string;
    code?: string;
    description?: string;
    icon?: string;
    path?: string;
    isActive?: boolean;
    order?: number;
    parentId?: string | null;
}

export interface ISystemModuleRepository {
    findAll(options: SystemModuleFilterOptions): Promise<{ data: SystemModule[]; total: number }>;
    findById(id: string): Promise<SystemModule | null>;
    findByCode(code: string): Promise<SystemModule | null>;
    create(data: CreateSystemModuleInput): Promise<SystemModule>;
    update(id: string, data: UpdateSystemModuleInput): Promise<SystemModule>;
    deactivate(id: string): Promise<SystemModule>;
}

export const ISystemModuleRepository = Symbol('ISystemModuleRepository');
