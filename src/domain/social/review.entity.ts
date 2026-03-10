export class Review {
    id: string;
    rating: number;
    comment?: string | null;
    userId: string;
    placeId?: string | null;
    routeId?: string | null;
    createdAt: Date;

    constructor(partial: Partial<Review>) {
        Object.assign(this, partial);
    }
}
