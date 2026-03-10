import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { IRouteRepository } from '../../../../domain/routes/interfaces/route.repository.interface';
import { RouteEntity } from '../../../../domain/routes/entities/route.entity';

@Injectable()
export class PrismaRouteRepository implements IRouteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<RouteEntity[]> {
    const records = await this.prisma.route.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        difficulty: true,
      }
    });
    return records.map(this.mapToDomain);
  }

  async findById(id: string): Promise<RouteEntity | null> {
    const record = await this.prisma.route.findUnique({
      where: { id },
      include: {
        difficulty: true,
      }
    });
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async create(data: Partial<RouteEntity>): Promise<RouteEntity> {
    const record = await this.prisma.route.create({
      data: {
        name: data.name!,
        description: data.description,
        difficultyId: data.difficultyId!,
        estimatedTime: data.estimatedTime,
        distanceKm: data.distanceKm,
        metadata: data.metadata ?? {},
        isActive: data.isActive ?? true,
      },
    });
    return this.mapToDomain(record);
  }

  async update(id: string, data: Partial<RouteEntity>): Promise<RouteEntity> {
    const record = await this.prisma.route.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        difficultyId: data.difficultyId,
        estimatedTime: data.estimatedTime,
        distanceKm: data.distanceKm,
        metadata: data.metadata,
        isActive: data.isActive,
      },
    });
    return this.mapToDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.route.delete({
      where: { id },
    });
  }

  private mapToDomain(record: any): RouteEntity {
    return new RouteEntity({
      id: record.id,
      name: record.name,
      description: record.description ?? undefined,
      difficultyId: record.difficultyId,
      estimatedTime: record.estimatedTime ?? undefined,
      distanceKm: record.distanceKm ?? undefined,
      metadata: record.metadata ?? undefined,
      isActive: record.isActive,
    });
  }
}
