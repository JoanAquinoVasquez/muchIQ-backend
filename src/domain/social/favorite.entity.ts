export class Favorite {
    id: string;
    userId: string;
    placeId?: string | null;
    routeId?: string | null;
    createdAt: Date;

    constructor(partial: Partial<Favorite>) {
        Object.assign(this, partial);
    }
}
