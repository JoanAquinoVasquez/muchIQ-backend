import { RewardEntity } from '../entities/reward.entity';

export interface PaginatedRewards {
  data: RewardEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IRewardRepository {
  create(reward: RewardEntity): Promise<RewardEntity>;
  findById(id: string): Promise<RewardEntity | null>;
  findAll(page: number, limit: number, filters?: any): Promise<PaginatedRewards>;
  update(id: string, reward: Partial<RewardEntity>): Promise<RewardEntity>;
  delete(id: string): Promise<void>;
  decrementStock(id: string, amount: number): Promise<void>;
}
