export enum PlaceCategory {
    GENERAL = 'GENERAL',
    GASTRONOMY = 'GASTRONOMY',
    CULTURE = 'CULTURE',
    NATURE = 'NATURE',
    ADVENTURE = 'ADVENTURE'
}

export class Place {
    id: string;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    category: PlaceCategory;
    metadata?: any | null;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<Place>) {
        Object.assign(this, partial);
    }
}
