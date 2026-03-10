import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DifficultyLevelsService } from '../services/difficulty-levels.service';
import { CreateDifficultyLevelDto } from '../dto/create-difficulty-level.dto';
import { UpdateDifficultyLevelDto } from '../dto/update-difficulty-level.dto';

@ApiTags('Difficulty Levels')
@Controller('difficulty-levels')
export class DifficultyLevelsController {
  constructor(private readonly difficultyLevelsService: DifficultyLevelsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo nivel de dificultad' })
  @ApiResponse({ status: 201, description: 'The difficulty level has been successfully created.' })
  create(@Body() createDifficultyLevelDto: CreateDifficultyLevelDto) {
    return this.difficultyLevelsService.create(createDifficultyLevelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los niveles de dificultad' })
  findAll() {
    return this.difficultyLevelsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un nivel de dificultad por ID' })
  findOne(@Param('id') id: string) {
    return this.difficultyLevelsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un nivel de dificultad' })
  update(@Param('id') id: string, @Body() updateDifficultyLevelDto: UpdateDifficultyLevelDto) {
    return this.difficultyLevelsService.update(id, updateDifficultyLevelDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un nivel de dificultad' })
  remove(@Param('id') id: string) {
    return this.difficultyLevelsService.remove(id);
  }
}
