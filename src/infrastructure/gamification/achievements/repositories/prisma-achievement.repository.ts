import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IAchievementRepository, PaginatedAchievements } from '../../../../domain/gamification/interfaces/achievement.repository.interface';
import { AchievementEntity } from '../../../../domain/gamification/entities/achievement.entity';

@Injectable()
export class PrismaAchievementRepository implements IAchievementRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(record: any): AchievementEntity {
    return new AchievementEntity(
      record.id,
      record.name,
      record.description,
      record.points,
      record.isActive,
      record.criteria,
      record.icon,
      record.createdAt,
    );
  }

  async create(achievement: AchievementEntity): Promise<AchievementEntity> {
    const record = await this.prisma.achievement.create({
      data: {
        name: achievement.name,
        description: achievement.description,
        points: achievement.points,
        isActive: achievement.isActive,
        criteria: achievement.criteria,
        icon: achievement.icon,
      },
    });
    return this.mapToDomain(record);
  }

  async findById(id: string): Promise<AchievementEntity | null> {
    const record = await this.prisma.achievement.findUnique({ where: { id } });
    return record ? this.mapToDomain(record) : null;
  }

  async findAll(page: number, limit: number, filters?: any): Promise<PaginatedAchievements> {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    if (filters?.name) {
      where.name = { contains: filters.name, mode: 'insensitive' };
    }

    const [records, total] = await Promise.all([
      this.prisma.achievement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.achievement.count({ where }),
    ]);

    return {
      data: records.map((record) => this.mapToDomain(record)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, achievement: Partial<AchievementEntity>): Promise<AchievementEntity> {
    const record = await this.prisma.achievement.update({
      where: { id },
      data: {
        name: achievement.name,
        description: achievement.description,
        points: achievement.points,
        isActive: achievement.isActive,
        criteria: achievement.criteria,
        icon: achievement.icon,
      },
    });
    return this.mapToDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.achievement.delete({ where: { id } });
  }
}
