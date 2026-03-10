import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MediaService } from '../services/media.service';
import { CreateMediaDto, CreateMediaTypeDto } from '../dto/create-media.dto';
import { UpdateMediaTypeDto } from '../dto/update-media.dto';

@ApiTags('Media Types')
@Controller('media-types')
export class MediaTypesController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo tipo de medio' })
  create(@Body() dto: CreateMediaTypeDto) {
    return this.mediaService.createMediaType(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tipos de medios' })
  findAll() {
    return this.mediaService.findAllMediaTypes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de medio por ID' })
  findOne(@Param('id') id: string) {
    return this.mediaService.findOneMediaType(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un tipo de medio por ID' })
  update(@Param('id') id: string, @Body() dto: UpdateMediaTypeDto) {
    return this.mediaService.updateMediaType(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un tipo de medio por ID' })
  remove(@Param('id') id: string) {
    return this.mediaService.removeMediaType(id);
  }
}

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva entrada multimedia' })
  create(@Body() dto: CreateMediaDto) {
    return this.mediaService.createMedia(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los archivos multimedia' })
  findAll() {
    return this.mediaService.findAllMedia();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un archivo multimedia por ID' })
  findOne(@Param('id') id: string) {
    return this.mediaService.findOneMedia(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un archivo multimedia por ID' })
  remove(@Param('id') id: string) {
    return this.mediaService.removeMedia(id);
  }
}
