import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IPlaceRepository } from '../../domain/places/place.repository';
import { Place } from '../../domain/places/place.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaPlaceRepository implements IPlaceRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Place | null> {
    const place = await this.prisma.place.findUnique({
      where: { id },
      include: {
        categories: {
          include: { category: true },
        },
        placeDishes: {
          include: { dish: true },
        },
      },
    });
    return place ? new Place(place as unknown as Partial<Place>) : null;
  }

  async findAll(): Promise<Place[]> {
    const places = await this.prisma.place.findMany({
      include: {
        categories: {
          include: { category: true },
        },
      },
    });
    return places.map((p) => new Place(p as unknown as Partial<Place>));
  }

  async findByCategory(categoryId: string): Promise<Place[]> {
    const places = await this.prisma.place.findMany({
      where: {
        categories: {
          some: { categoryId },
        },
      },
      include: {
        categories: {
          include: { category: true },
        },
      },
    });
    return places.map((p) => new Place(p as unknown as Partial<Place>));
  }

  async create(data: Partial<Place>): Promise<Place> {
    const place = await this.prisma.place.create({
      data: {
        name: data.name!,
        description: data.description!,
        latitude: data.latitude!,
        longitude: data.longitude!,
        metadata: (data.metadata as Prisma.InputJsonValue) || Prisma.DbNull,
        // Si viene un categoryId en el DTO/data, lo conectamos
        ...((data as any).categoryId
          ? {
              categories: {
                create: { categoryId: (data as any).categoryId },
              },
            }
          : {}),
      },
      include: {
        categories: {
          include: { category: true },
        },
      },
    });
    return new Place(place as unknown as Partial<Place>);
  }

  async update(id: string, data: Partial<Place>): Promise<Place> {
    const place = await this.prisma.place.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        metadata: data.metadata as Prisma.InputJsonValue,
        isActive: data.isActive,
      },
      include: {
        categories: {
          include: { category: true },
        },
      },
    });
    return new Place(place as unknown as Partial<Place>);
  }
}
