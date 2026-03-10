export class PermissionAction {
    id: string;
    name: string;
    code: string;
    description: string | null;

    constructor(partial: Partial<PermissionAction>) {
        Object.assign(this, partial);
    }
}
