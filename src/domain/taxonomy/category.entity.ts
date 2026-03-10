export class Category {
    id: string;
    name: string;
    description?: string | null;
    icon?: string | null;
    isActive: boolean;
    createdAt: Date;

    constructor(partial: Partial<Category>) {
        Object.assign(this, partial);
    }
}
