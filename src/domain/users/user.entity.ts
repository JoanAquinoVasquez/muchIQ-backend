export enum UserRole {
    EXPLORER = 'EXPLORER',
    PARTNER = 'PARTNER',
    ADMIN = 'ADMIN',
}

export class User {
    id: string;
    email: string;
    password?: string;
    name?: string | null;
    role: UserRole;
    points: number;
    totalExp: number;
    createdAt: Date;
    updatedAt: Date;
    profile?: any | null;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}
