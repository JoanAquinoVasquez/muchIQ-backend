import { DifficultyLevelEntity } from '../entities/difficulty-level.entity';

export interface IDifficultyLevelRepository {
  findAll(): Promise<DifficultyLevelEntity[]>;
  findById(id: string): Promise<DifficultyLevelEntity | null>;
  create(data: Partial<DifficultyLevelEntity>): Promise<DifficultyLevelEntity>;
  update(id: string, data: Partial<DifficultyLevelEntity>): Promise<DifficultyLevelEntity>;
  delete(id: string): Promise<void>;
}

export const IDifficultyLevelRepository = Symbol('IDifficultyLevelRepository');
