import { Inject, Injectable } from '@nestjs/common';
import type { IRewardRepository, PaginatedRewards } from '../../../../domain/gamification/interfaces/reward.repository.interface';
import { RewardEntity } from '../../../../domain/gamification/entities/reward.entity';
import { CreateRewardDto, UpdateRewardDto } from '../dto/reward.dto';
import { RewardNotFoundException } from '../../../../domain/gamification/exceptions/reward.exception';

@Injectable()
export class RewardsService {
  constructor(
    @Inject('IRewardRepository')
    private readonly rewardRepository: IRewardRepository,
  ) {}

  async create(createDto: CreateRewardDto): Promise<RewardEntity> {
    const entity = RewardEntity.create(createDto);
    return this.rewardRepository.create(entity);
  }

  async findAll(page: number = 1, limit: number = 10, filters?: any): Promise<PaginatedRewards> {
    return this.rewardRepository.findAll(page, limit, filters);
  }

  async findOne(id: string): Promise<RewardEntity> {
    const reward = await this.rewardRepository.findById(id);
    if (!reward) {
      throw new RewardNotFoundException(id);
    }
    return reward;
  }

  async update(id: string, updateDto: UpdateRewardDto): Promise<RewardEntity> {
    await this.findOne(id);
    return this.rewardRepository.update(id, updateDto as Partial<RewardEntity>);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    return this.rewardRepository.delete(id);
  }
}
