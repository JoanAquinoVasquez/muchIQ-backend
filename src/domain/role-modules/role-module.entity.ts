export class RoleModule {
    id: string;
    roleId: string;
    moduleId: string;

    // Poblados con include
    role?: { id: string; name: string };
    module?: { id: string; name: string; code: string };
    permissions?: RoleModulePermission[];

    constructor(partial: Partial<RoleModule>) {
        Object.assign(this, partial);
    }
}

export class RoleModulePermission {
    id: string;
    roleModuleId: string;
    permissionActionId: string;
    permissionAction?: { id: string; name: string; code: string };

    constructor(partial: Partial<RoleModulePermission>) {
        Object.assign(this, partial);
    }
}
