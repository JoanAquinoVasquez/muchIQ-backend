import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { IMediaRepository, IMediaTypeRepository } from '../../../domain/media/interfaces/media.repository.interface';
import { MediaEntity, MediaTypeEntity } from '../../../domain/media/entities/media.entity';

@Injectable()
export class PrismaMediaTypeRepository implements IMediaTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<MediaTypeEntity[]> {
    const records = await this.prisma.mediaType.findMany();
    return records.map(this.mapToDomain);
  }

  async findById(id: string): Promise<MediaTypeEntity | null> {
    const record = await this.prisma.mediaType.findUnique({
      where: { id },
    });
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async create(data: Partial<MediaTypeEntity>): Promise<MediaTypeEntity> {
    const record = await this.prisma.mediaType.create({
      data: {
        name: data.name!,
        description: data.description,
        extension: data.extension,
      },
    });
    return this.mapToDomain(record);
  }

  async update(id: string, data: Partial<MediaTypeEntity>): Promise<MediaTypeEntity> {
    const record = await this.prisma.mediaType.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        extension: data.extension,
      },
    });
    return this.mapToDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.mediaType.delete({
      where: { id },
    });
  }

  private mapToDomain(record: any): MediaTypeEntity {
    return new MediaTypeEntity({
      id: record.id,
      name: record.name,
      description: record.description ?? undefined,
      extension: record.extension ?? undefined,
    });
  }
}

@Injectable()
export class PrismaMediaRepository implements IMediaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<MediaEntity[]> {
    const records = await this.prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return records.map(this.mapToDomain);
  }

  async findById(id: string): Promise<MediaEntity | null> {
    const record = await this.prisma.media.findUnique({
      where: { id },
    });
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async create(data: Partial<MediaEntity>): Promise<MediaEntity> {
    const record = await this.prisma.media.create({
      data: {
        url: data.url!,
        caption: data.caption,
        mediaTypeId: data.mediaTypeId!,
        placeId: data.placeId,
        routeId: data.routeId,
        rewardId: data.rewardId,
        userId: data.userId,
      },
    });
    return this.mapToDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.media.delete({
      where: { id },
    });
  }

  private mapToDomain(record: any): MediaEntity {
    return new MediaEntity({
      id: record.id,
      url: record.url,
      caption: record.caption ?? undefined,
      mediaTypeId: record.mediaTypeId,
      placeId: record.placeId ?? undefined,
      routeId: record.routeId ?? undefined,
      rewardId: record.rewardId ?? undefined,
      userId: record.userId ?? undefined,
    });
  }
}
