import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IDiscoveryRepository, PaginatedDiscoveries } from '../../../../domain/gamification/interfaces/discovery.repository.interface';
import { DiscoveryEntity } from '../../../../domain/gamification/entities/discovery.entity';

@Injectable()
export class PrismaDiscoveryRepository implements IDiscoveryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(record: any): DiscoveryEntity {
    return new DiscoveryEntity(
      record.id,
      record.userId,
      record.placeId,
      record.points,
      record.createdAt,
    );
  }

  async create(discovery: DiscoveryEntity): Promise<DiscoveryEntity> {
    const record = await this.prisma.discovery.create({
      data: {
        userId: discovery.userId,
        placeId: discovery.placeId,
        points: discovery.points,
      },
    });
    return this.mapToDomain(record);
  }

  async findById(id: string): Promise<DiscoveryEntity | null> {
    const record = await this.prisma.discovery.findUnique({ where: { id } });
    return record ? this.mapToDomain(record) : null;
  }

  async findByUserAndPlace(userId: string, placeId: string): Promise<DiscoveryEntity | null> {
    const record = await this.prisma.discovery.findUnique({
      where: {
        userId_placeId: { userId, placeId },
      },
    });
    return record ? this.mapToDomain(record) : null;
  }

  async findAll(page: number, limit: number, filters?: any): Promise<PaginatedDiscoveries> {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters?.userId) {
      where.userId = filters.userId;
    }
    if (filters?.placeId) {
      where.placeId = filters.placeId;
    }

    const [records, total] = await Promise.all([
      this.prisma.discovery.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.discovery.count({ where }),
    ]);

    return {
      data: records.map((record) => this.mapToDomain(record)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.discovery.delete({ where: { id } });
  }
}
