export class Media {
    id: string;
    url: string;
    caption?: string | null;
    mediaTypeId: string;
    placeId?: string | null;
    routeId?: string | null;
    rewardId?: string | null;
    userId?: string | null;
    createdAt: Date;

    constructor(partial: Partial<Media>) {
        Object.assign(this, partial);
    }
}
