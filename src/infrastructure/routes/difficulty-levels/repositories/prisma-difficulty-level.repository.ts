import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { IDifficultyLevelRepository } from '../../../../domain/routes/interfaces/difficulty-level.repository.interface';
import { DifficultyLevelEntity } from '../../../../domain/routes/entities/difficulty-level.entity';

@Injectable()
export class PrismaDifficultyLevelRepository implements IDifficultyLevelRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<DifficultyLevelEntity[]> {
    const records = await this.prisma.difficultyLevel.findMany({
      orderBy: { order: 'asc' },
    });
    return records.map(this.mapToDomain);
  }

  async findById(id: string): Promise<DifficultyLevelEntity | null> {
    const record = await this.prisma.difficultyLevel.findUnique({
      where: { id },
    });
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async create(data: Partial<DifficultyLevelEntity>): Promise<DifficultyLevelEntity> {
    const record = await this.prisma.difficultyLevel.create({
      data: {
        name: data.name!,
        description: data.description,
        color: data.color,
        order: data.order ?? 0,
      },
    });
    return this.mapToDomain(record);
  }

  async update(id: string, data: Partial<DifficultyLevelEntity>): Promise<DifficultyLevelEntity> {
    const record = await this.prisma.difficultyLevel.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        color: data.color,
        order: data.order,
      },
    });
    return this.mapToDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.difficultyLevel.delete({
      where: { id },
    });
  }

  private mapToDomain(record: any): DifficultyLevelEntity {
    return new DifficultyLevelEntity({
      id: record.id,
      name: record.name,
      description: record.description ?? undefined,
      color: record.color ?? undefined,
      order: record.order,
    });
  }
}
