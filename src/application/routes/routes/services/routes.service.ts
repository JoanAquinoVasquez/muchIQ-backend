import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRouteRepository } from '../../../../domain/routes/interfaces/route.repository.interface';
import { RouteNotFoundException } from '../../../../domain/routes/exceptions/route.exception';
import { CreateRouteDto } from '../dto/create-route.dto';
import { UpdateRouteDto } from '../dto/update-route.dto';

@Injectable()
export class RoutesService {
  constructor(
    @Inject(IRouteRepository)
    private readonly repository: IRouteRepository,
  ) {}

  async create(createRouteDto: CreateRouteDto) {
    return this.repository.create(createRouteDto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const route = await this.repository.findById(id);
    if (!route) {
      throw new NotFoundException(`Route ${id} not found`);
    }
    return route;
  }

  async update(id: string, updateRouteDto: UpdateRouteDto) {
    const route = await this.repository.findById(id);
    if (!route) {
      throw new NotFoundException(`Route ${id} not found`);
    }
    return this.repository.update(id, updateRouteDto);
  }

  async remove(id: string) {
    const route = await this.repository.findById(id);
    if (!route) {
      throw new NotFoundException(`Route ${id} not found`);
    }
    return this.repository.delete(id);
  }
}
