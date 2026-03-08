import { Place } from './place.entity';

export interface IPlaceRepository {
    findById(id: string): Promise<Place | null>;
    findAll(): Promise<Place[]>;
    findByCategory(category: string): Promise<Place[]>;
    create(data: Partial<Place>): Promise<Place>;
    update(id: string, data: Partial<Place>): Promise<Place>;
}

export const IPlaceRepository = Symbol('IPlaceRepository');
