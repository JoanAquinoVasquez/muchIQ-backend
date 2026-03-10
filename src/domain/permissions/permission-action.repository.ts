import { PermissionAction } from './permission-action.entity';

export interface CreatePermissionActionInput {
    name: string;
    code: string;
    description?: string;
}

export interface UpdatePermissionActionInput {
    name?: string;
    code?: string;
    description?: string;
}

export interface IPermissionActionRepository {
    findAll(): Promise<PermissionAction[]>;
    findById(id: string): Promise<PermissionAction | null>;
    findByCode(code: string): Promise<PermissionAction | null>;
    create(data: CreatePermissionActionInput): Promise<PermissionAction>;
    update(id: string, data: UpdatePermissionActionInput): Promise<PermissionAction>;
    delete(id: string): Promise<void>;
}

export const IPermissionActionRepository = Symbol('IPermissionActionRepository');
