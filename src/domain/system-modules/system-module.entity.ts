export class SystemModule {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    path: string | null;
    code: string;
    isActive: boolean;
    order: number;
    parentId: string | null;
    createdAt: Date;

    // Poblados con include
    parent?: SystemModule | null;
    children?: SystemModule[];

    constructor(partial: Partial<SystemModule>) {
        Object.assign(this, partial);
    }
}
