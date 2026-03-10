export class PointTransaction {
    id: string;
    amount: number;
    reason?: string | null;
    referenceId?: string | null;
    userId: string;
    createdAt: Date;

    constructor(partial: Partial<PointTransaction>) {
        Object.assign(this, partial);
    }
}
