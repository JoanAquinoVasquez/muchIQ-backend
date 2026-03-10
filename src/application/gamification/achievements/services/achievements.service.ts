import { Inject, Injectable } from '@nestjs/common';
import type { IAchievementRepository, PaginatedAchievements } from '../../../../domain/gamification/interfaces/achievement.repository.interface';
import { AchievementEntity } from '../../../../domain/gamification/entities/achievement.entity';
import { CreateAchievementDto, UpdateAchievementDto } from '../dto/achievement.dto';
import { AchievementNotFoundException } from '../../../../domain/gamification/exceptions/achievement.exception';

@Injectable()
export class AchievementsService {
  constructor(
    @Inject('IAchievementRepository')
    private readonly achievementRepository: IAchievementRepository,
  ) {}

  async create(createDto: CreateAchievementDto): Promise<AchievementEntity> {
    const entity = AchievementEntity.create(createDto);
    return this.achievementRepository.create(entity);
  }

  async findAll(page: number = 1, limit: number = 10, filters?: any): Promise<PaginatedAchievements> {
    return this.achievementRepository.findAll(page, limit, filters);
  }

  async findOne(id: string): Promise<AchievementEntity> {
    const achievement = await this.achievementRepository.findById(id);
    if (!achievement) {
      throw new AchievementNotFoundException(id);
    }
    return achievement;
  }

  async update(id: string, updateDto: UpdateAchievementDto): Promise<AchievementEntity> {
    await this.findOne(id); // Ensure exists
    return this.achievementRepository.update(id, updateDto as Partial<AchievementEntity>);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Ensure exists
    return this.achievementRepository.delete(id);
  }
}
