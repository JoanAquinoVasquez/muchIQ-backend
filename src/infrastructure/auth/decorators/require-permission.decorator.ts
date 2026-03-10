import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'required_permission';

export interface RequiredPermission {
    moduleCode: string;
    permissionCode: string;
}

// Uso: @RequirePermission('companies', 'create')
export const RequirePermission = (
    moduleCode: string,
    permissionCode: string,
): MethodDecorator =>
    SetMetadata<string, RequiredPermission>(PERMISSION_KEY, { moduleCode, permissionCode });
