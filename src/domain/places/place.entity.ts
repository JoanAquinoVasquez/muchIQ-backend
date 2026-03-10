export class Place {
    id: string;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    address?: string | null;
    district?: string | null;
    city?: string | null;
    country?: string | null;
    metadata?: any | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

    // Relaciones (Pivot many-to-many en el nuevo esquema)
    categories?: any[]; 

    constructor(partial: Partial<Place>) {
        Object.assign(this, partial);
    }
}
