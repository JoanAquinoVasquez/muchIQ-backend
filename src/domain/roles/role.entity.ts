export class Role {
    id: string;
    name: string;
    description: string | null;
    color: string | null;
    isActive: boolean;
    createdAt: Date;

    constructor(partial: Partial<Role>) {
        Object.assign(this, partial);
    }
}
