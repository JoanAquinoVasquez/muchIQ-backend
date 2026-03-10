export class Achievement {
    id: string;
    name: string;
    description: string;
    icon?: string | null;
    points: number;
    criteria?: any;
    isActive: boolean;
    createdAt: Date;

    constructor(partial: Partial<Achievement>) {
        Object.assign(this, partial);
    }
}
