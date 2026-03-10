export class Reward {
    id: string;
    name: string;
    description?: string | null;
    cost: number;
    stock: number;
    isActive: boolean;
    companyId?: string | null;
    businessLocationId?: string | null;
    createdAt: Date;

    constructor(partial: Partial<Reward>) {
        Object.assign(this, partial);
    }
}
