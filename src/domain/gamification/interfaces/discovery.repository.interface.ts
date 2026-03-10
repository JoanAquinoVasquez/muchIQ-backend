import { DiscoveryEntity } from '../entities/discovery.entity';

export interface PaginatedDiscoveries {
  data: DiscoveryEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IDiscoveryRepository {
  create(discovery: DiscoveryEntity): Promise<DiscoveryEntity>;
  findById(id: string): Promise<DiscoveryEntity | null>;
  findByUserAndPlace(userId: string, placeId: string): Promise<DiscoveryEntity | null>;
  findAll(page: number, limit: number, filters?: any): Promise<PaginatedDiscoveries>;
  delete(id: string): Promise<void>;
}
