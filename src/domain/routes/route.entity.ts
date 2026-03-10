export class Route {
    id: string;
    name: string;
    description?: string | null;
    difficultyId: string;
    estimatedTime?: number | null;
    distanceKm?: number | null;
    metadata?: any;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

    // Relaciones
    difficulty?: any;
    categories?: any[];
    places?: any[];

    constructor(partial: Partial<Route>) {
        Object.assign(this, partial);
    }
}
