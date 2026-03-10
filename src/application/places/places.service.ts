import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IPlaceRepository } from '../../domain/places/place.repository';
import { Place } from '../../domain/places/place.entity';

@Injectable()
export class PlacesService {
    constructor(
        @Inject(IPlaceRepository)
        private readonly placeRepository: IPlaceRepository
    ) { }

    async getAllPlaces(): Promise<Place[]> {
        return this.placeRepository.findAll();
    }

    async getPlaceById(id: string): Promise<Place> {
        const place = await this.placeRepository.findById(id);
        if (!place) {
            throw new NotFoundException(`Place with ID ${id} not found`);
        }
        return place;
    }

    async getPlacesByCategory(categoryId: string): Promise<Place[]> {
        return this.placeRepository.findByCategory(categoryId);
    }

    async createPlace(data: Partial<Place>): Promise<Place> {
        return this.placeRepository.create(data);
    }
}
