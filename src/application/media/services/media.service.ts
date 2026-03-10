import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IMediaRepository, IMediaTypeRepository } from '../../../domain/media/interfaces/media.repository.interface';
import { CreateMediaDto, CreateMediaTypeDto } from '../dto/create-media.dto';
import { UpdateMediaTypeDto } from '../dto/update-media.dto';

@Injectable()
export class MediaService {
  constructor(
    @Inject(IMediaRepository)
    private readonly mediaRepository: IMediaRepository,
    @Inject(IMediaTypeRepository)
    private readonly mediaTypeRepository: IMediaTypeRepository,
  ) {}

  // Media Types
  async createMediaType(dto: CreateMediaTypeDto) {
    return this.mediaTypeRepository.create(dto);
  }

  async findAllMediaTypes() {
    return this.mediaTypeRepository.findAll();
  }

  async findOneMediaType(id: string) {
    const type = await this.mediaTypeRepository.findById(id);
    if (!type) throw new NotFoundException(`Media Type ${id} not found`);
    return type;
  }

  async updateMediaType(id: string, dto: UpdateMediaTypeDto) {
    const type = await this.mediaTypeRepository.findById(id);
    if (!type) throw new NotFoundException(`Media Type ${id} not found`);
    return this.mediaTypeRepository.update(id, dto);
  }

  async removeMediaType(id: string) {
    const type = await this.mediaTypeRepository.findById(id);
    if (!type) throw new NotFoundException(`Media Type ${id} not found`);
    return this.mediaTypeRepository.delete(id);
  }

  // Media
  async createMedia(dto: CreateMediaDto) {
    return this.mediaRepository.create(dto);
  }

  async findAllMedia() {
    return this.mediaRepository.findAll();
  }

  async findOneMedia(id: string) {
    const media = await this.mediaRepository.findById(id);
    if (!media) throw new NotFoundException(`Media ${id} not found`);
    return media;
  }

  async removeMedia(id: string) {
    const media = await this.mediaRepository.findById(id);
    if (!media) throw new NotFoundException(`Media ${id} not found`);
    return this.mediaRepository.delete(id);
  }
}
