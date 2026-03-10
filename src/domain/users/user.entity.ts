export class User {
    id: string;
    email: string;
    password?: string;
    name?: string | null;
    phone?: string | null;
    avatar?: string | null;
    roleId: string;
    role?: {
        name: string;
    };
    points: number;
    totalExp: number;
    profile?: any | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}
