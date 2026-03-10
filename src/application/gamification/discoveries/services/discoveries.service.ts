import { Inject, Injectable } from '@nestjs/common';
import type { IDiscoveryRepository, PaginatedDiscoveries } from '../../../../domain/gamification/interfaces/discovery.repository.interface';
import { DiscoveryEntity } from '../../../../domain/gamification/entities/discovery.entity';
import { CreateDiscoveryDto } from '../dto/discovery.dto';
import { DiscoveryNotFoundException, DuplicateDiscoveryException } from '../../../../domain/gamification/exceptions/discovery.exception';

@Injectable()
export class DiscoveriesService {
  constructor(
    @Inject('IDiscoveryRepository')
    private readonly discoveryRepository: IDiscoveryRepository,
  ) {}

  async create(createDto: CreateDiscoveryDto): Promise<DiscoveryEntity> {
    // Check if user already discovered this place
    const existing = await this.discoveryRepository.findByUserAndPlace(createDto.userId, createDto.placeId);
    if (existing) {
      throw new DuplicateDiscoveryException(createDto.userId, createDto.placeId);
    }

    const entity = DiscoveryEntity.create(createDto);
    return this.discoveryRepository.create(entity);
  }

  async findAll(page: number = 1, limit: number = 10, filters?: any): Promise<PaginatedDiscoveries> {
    return this.discoveryRepository.findAll(page, limit, filters);
  }

  async findOne(id: string): Promise<DiscoveryEntity> {
    const discovery = await this.discoveryRepository.findById(id);
    if (!discovery) {
      throw new DiscoveryNotFoundException(id);
    }
    return discovery;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    return this.discoveryRepository.delete(id);
  }
}
