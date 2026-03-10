import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IDifficultyLevelRepository } from '../../../../domain/routes/interfaces/difficulty-level.repository.interface';
import { DifficultyLevelNotFoundException } from '../../../../domain/routes/exceptions/difficulty-level.exception';
import { CreateDifficultyLevelDto } from '../dto/create-difficulty-level.dto';
import { UpdateDifficultyLevelDto } from '../dto/update-difficulty-level.dto';

@Injectable()
export class DifficultyLevelsService {
  constructor(
    @Inject(IDifficultyLevelRepository)
    private readonly repository: IDifficultyLevelRepository,
  ) {}

  async create(createDifficultyLevelDto: CreateDifficultyLevelDto) {
    return this.repository.create(createDifficultyLevelDto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const level = await this.repository.findById(id);
    if (!level) {
      throw new NotFoundException(`Difficulty level ${id} not found`);
    }
    return level;
  }

  async update(id: string, updateDifficultyLevelDto: UpdateDifficultyLevelDto) {
    const level = await this.repository.findById(id);
    if (!level) {
      throw new NotFoundException(`Difficulty level ${id} not found`);
    }
    return this.repository.update(id, updateDifficultyLevelDto);
  }

  async remove(id: string) {
    const level = await this.repository.findById(id);
    if (!level) {
      throw new NotFoundException(`Difficulty level ${id} not found`);
    }
    return this.repository.delete(id);
  }
}
