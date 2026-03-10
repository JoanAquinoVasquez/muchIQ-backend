import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IRewardRepository, PaginatedRewards } from '../../../../domain/gamification/interfaces/reward.repository.interface';
import { RewardEntity } from '../../../../domain/gamification/entities/reward.entity';

@Injectable()
export class PrismaRewardRepository implements IRewardRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(record: any): RewardEntity {
    return new RewardEntity(
      record.id,
      record.name,
      record.description,
      record.cost,
      record.stock,
      record.isActive,
      record.companyId,
      record.businessLocationId,
      record.createdAt,
    );
  }

  async create(reward: RewardEntity): Promise<RewardEntity> {
    const record = await this.prisma.reward.create({
      data: {
        name: reward.name,
        description: reward.description,
        cost: reward.cost,
        stock: reward.stock,
        isActive: reward.isActive,
        companyId: reward.companyId,
        businessLocationId: reward.businessLocationId,
      },
    });
    return this.mapToDomain(record);
  }

  async findById(id: string): Promise<RewardEntity | null> {
    const record = await this.prisma.reward.findUnique({ where: { id } });
    return record ? this.mapToDomain(record) : null;
  }

  async findAll(page: number, limit: number, filters?: any): Promise<PaginatedRewards> {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    if (filters?.name) {
      where.name = { contains: filters.name, mode: 'insensitive' };
    }
    if (filters?.companyId) {
        where.companyId = filters.companyId;
    }

    const [records, total] = await Promise.all([
      this.prisma.reward.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.reward.count({ where }),
    ]);

    return {
      data: records.map((record) => this.mapToDomain(record)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, reward: Partial<RewardEntity>): Promise<RewardEntity> {
    const record = await this.prisma.reward.update({
      where: { id },
      data: {
        name: reward.name,
        description: reward.description,
        cost: reward.cost,
        stock: reward.stock,
        isActive: reward.isActive,
        companyId: reward.companyId,
        businessLocationId: reward.businessLocationId,
      },
    });
    return this.mapToDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.reward.delete({ where: { id } });
  }

  async decrementStock(id: string, amount: number): Promise<void> {
     // Prisma doesn't have a direct decrement if evaluating conditions in the same query reliably without transactions,
     // but we can do an atomic decrement on the field.
     await this.prisma.reward.update({
        where: { id },
        data: {
            stock: { decrement: amount }
        }
     });
  }
}
