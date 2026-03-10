import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PlacesService } from '../../application/places/places.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePlaceDto } from './dto/create-place.dto';

@ApiTags('places')
@Controller('places')
export class PlacesController {
    constructor(private readonly placesService: PlacesService) { }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los lugares' })
    @ApiResponse({ status: 200, description: 'Return all places' })
    async findAll() {
        return this.placesService.getAllPlaces();
    }

    @Get('filter')
    @ApiOperation({ summary: 'Filtrar lugares por ID de categoría' })
    async findByCategory(@Query('categoryId') categoryId: string) {
        return this.placesService.getPlacesByCategory(categoryId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener lugar por ID' })
    async findOne(@Param('id') id: string) {
        return this.placesService.getPlaceById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo lugar (Solo Admin/Propietario en el futuro)' })
    @ApiResponse({ status: 201, description: 'Place successfully created' })
    async create(@Body() createPlaceDto: CreatePlaceDto) {
        return this.placesService.createPlace(createPlaceDto);
    }
}
