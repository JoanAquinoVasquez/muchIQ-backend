import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IPlaceRepository } from '../../domain/places/place.repository';
import { Place, PlaceCategory } from '../../domain/places/place.entity';

@Injectable()
export class PrismaPlaceRepository implements IPlaceRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string): Promise<Place | null> {
        const place = await this.prisma.place.findUnique({ where: { id } });
        return place ? new Place({ ...place, category: place.category as PlaceCategory }) : null;
    }

    async findAll(): Promise<Place[]> {
        const places = await this.prisma.place.findMany();
        return places.map(p => new Place({ ...p, category: p.category as PlaceCategory }));
    }

    async findByCategory(category: string): Promise<Place[]> {
        const places = await this.prisma.place.findMany({
            where: { category: category as any }
        });
        return places.map(p => new Place({ ...p, category: p.category as PlaceCategory }));
    }

    async create(data: Partial<Place>): Promise<Place> {
        const place = await this.prisma.place.create({
            data: {
                name: data.name!,
                description: data.description!,
                latitude: data.latitude!,
                longitude: data.longitude!,
                category: data.category as any || 'GENERAL',
                metadata: data.metadata || {},
            }
        });
        return new Place({ ...place, category: place.category as PlaceCategory });
    }

    async update(id: string, data: Partial<Place>): Promise<Place> {
        const place = await this.prisma.place.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                latitude: data.latitude,
                longitude: data.longitude,
                category: data.category as any,
                metadata: data.metadata,
            }
        });
        return new Place({ ...place, category: place.category as PlaceCategory });
    }
}
