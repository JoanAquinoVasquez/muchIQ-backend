import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PlacesService } from '../../application/places/places.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePlaceDto } from './dto/create-place.dto';

@ApiTags('places')
@Controller('places')
export class PlacesController {
    constructor(private readonly placesService: PlacesService) { }

    @Get()
    @ApiOperation({ summary: 'Get all places' })
    @ApiResponse({ status: 200, description: 'Return all places' })
    async findAll() {
        return this.placesService.getAllPlaces();
    }

    @Get('filter')
    @ApiOperation({ summary: 'Filter places by category' })
    async findByCategory(@Query('category') category: string) {
        return this.placesService.getPlacesByCategory(category);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get place by ID' })
    async findOne(@Param('id') id: string) {
        return this.placesService.getPlaceById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new place (Admin/Owner only in future)' })
    @ApiResponse({ status: 201, description: 'Place successfully created' })
    async create(@Body() createPlaceDto: CreatePlaceDto) {
        return this.placesService.createPlace(createPlaceDto);
    }
}
