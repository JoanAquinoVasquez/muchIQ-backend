import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IDishRepository } from '../../domain/dishes/dish.repository';
import { Dish } from '../../domain/dishes/dish.entity';

@Injectable()
export class PrismaDishesRepository implements IDishRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get dishDelegate() {
    return (this.prisma as any).dish;
  }

  async findById(id: string): Promise<Dish | null> {
    const dish = await this.dishDelegate.findUnique({
      where: { id },
      include: {
        placeDishes: {
          include: {
            place: true,
          },
        },
        media: true,
      },
    });
    return dish ? new Dish(dish as unknown as Partial<Dish>) : null;
  }

  async findAll(): Promise<Dish[]> {
    const dishes = await this.dishDelegate.findMany({
      where: { isActive: true },
      include: {
        media: true,
      },
    });
    return dishes.map(
      (dish: any) => new Dish(dish as unknown as Partial<Dish>),
    );
  }

  async findByName(name: string): Promise<Dish | null> {
    const dish = await this.dishDelegate.findUnique({
      where: { name },
    });
    return dish ? new Dish(dish as unknown as Partial<Dish>) : null;
  }

  async create(data: Partial<Dish>): Promise<Dish> {
    const dish = await this.dishDelegate.create({
      data: {
        name: data.name!,
        description: data.description!,
        history: data.history,
      },
    });
    return new Dish(dish as unknown as Partial<Dish>);
  }

  async update(id: string, data: Partial<Dish>): Promise<Dish> {
    const dish = await this.dishDelegate.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        history: data.history,
        isActive: data.isActive,
      },
    });
    return new Dish(dish as unknown as Partial<Dish>);
  }

  async delete(id: string): Promise<Dish> {
    const dish = await this.dishDelegate.update({
      where: { id },
      data: { isActive: false },
    });
    return new Dish(dish as unknown as Partial<Dish>);
  }
}
