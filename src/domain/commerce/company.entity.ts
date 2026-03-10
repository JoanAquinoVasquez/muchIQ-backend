export class Company {
    id: string;
    name: string;
    ruc?: string | null;
    description?: string | null;
    logo?: string | null;
    website?: string | null;
    phone?: string | null;
    email?: string | null;
    isActive: boolean;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<Company>) {
        Object.assign(this, partial);
    }
}
