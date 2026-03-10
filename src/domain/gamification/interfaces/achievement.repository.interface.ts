import { AchievementEntity } from '../entities/achievement.entity';

export interface PaginatedAchievements {
  data: AchievementEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IAchievementRepository {
  create(achievement: AchievementEntity): Promise<AchievementEntity>;
  findById(id: string): Promise<AchievementEntity | null>;
  findAll(page: number, limit: number, filters?: any): Promise<PaginatedAchievements>;
  update(id: string, achievement: Partial<AchievementEntity>): Promise<AchievementEntity>;
  delete(id: string): Promise<void>;
}
