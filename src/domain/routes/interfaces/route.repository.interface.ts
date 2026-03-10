import { RouteEntity } from '../entities/route.entity';

export interface IRouteRepository {
  findAll(): Promise<RouteEntity[]>;
  findById(id: string): Promise<RouteEntity | null>;
  create(data: Partial<RouteEntity>): Promise<RouteEntity>;
  update(id: string, data: Partial<RouteEntity>): Promise<RouteEntity>;
  delete(id: string): Promise<void>;
}

export const IRouteRepository = Symbol('IRouteRepository');
