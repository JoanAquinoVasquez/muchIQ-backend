import { Dish } from './dish.entity';

export interface IDishRepository {
  findById(id: string): Promise<Dish | null>;
  findAll(): Promise<Dish[]>;
  findByName(name: string): Promise<Dish | null>;
  create(data: Partial<Dish>): Promise<Dish>;
  update(id: string, data: Partial<Dish>): Promise<Dish>;
  delete(id: string): Promise<Dish>;
}

export const IDishRepository = Symbol('IDishRepository');
