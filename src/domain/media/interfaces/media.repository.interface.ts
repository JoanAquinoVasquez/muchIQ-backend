import { MediaEntity, MediaTypeEntity } from '../entities/media.entity';

export interface IMediaRepository {
  findAll(): Promise<MediaEntity[]>;
  findById(id: string): Promise<MediaEntity | null>;
  create(data: Partial<MediaEntity>): Promise<MediaEntity>;
  delete(id: string): Promise<void>;
}

export interface IMediaTypeRepository {
  findAll(): Promise<MediaTypeEntity[]>;
  findById(id: string): Promise<MediaTypeEntity | null>;
  create(data: Partial<MediaTypeEntity>): Promise<MediaTypeEntity>;
  update(id: string, data: Partial<MediaTypeEntity>): Promise<MediaTypeEntity>;
  delete(id: string): Promise<void>;
}

export const IMediaRepository = Symbol('IMediaRepository');
export const IMediaTypeRepository = Symbol('IMediaTypeRepository');
