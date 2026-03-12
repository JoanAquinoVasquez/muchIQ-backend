import { Injectable, Inject } from '@nestjs/common';
import { IDishRepository } from '../../domain/dishes/dish.repository';
import { Dish } from '../../domain/dishes/dish.entity';
import { CreateDishDto } from '../../infrastructure/dishes/dto/create-dish.dto';

@Injectable()
export class DishesService {
  constructor(
    @Inject(IDishRepository)
    private readonly dishRepository: IDishRepository,
  ) {}

  async getAllDishes(): Promise<Dish[]> {
    return this.dishRepository.findAll();
  }

  async getDishById(id: string): Promise<Dish | null> {
    return this.dishRepository.findById(id);
  }

  async createDish(data: CreateDishDto): Promise<Dish> {
    return this.dishRepository.create(data);
  }

  async updateDish(id: string, data: Partial<Dish>): Promise<Dish> {
    return this.dishRepository.update(id, data);
  }

  async deleteDish(id: string): Promise<Dish> {
    return this.dishRepository.delete(id);
  }
}
