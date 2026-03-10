import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { DiscoveriesService } from '../../../../application/gamification/discoveries/services/discoveries.service';
import { CreateDiscoveryDto } from '../../../../application/gamification/discoveries/dto/discovery.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('Gamification - Discoveries')
@Controller('discoveries')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DiscoveriesController {
  constructor(private readonly discoveriesService: DiscoveriesService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo descubrimiento de lugar por un usuario' })
  @ApiResponse({ status: 201, description: 'Discovery registered successfully.' })
  create(@Body() createDiscoveryDto: CreateDiscoveryDto, @Request() req: any) {
    // Override user ID from token just in case
    createDiscoveryDto.userId = req.user.id;
    return this.discoveriesService.create(createDiscoveryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los descubrimientos con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'placeId', required: false, type: String })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('userId') userId?: string,
    @Query('placeId') placeId?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    
    return this.discoveriesService.findAll(pageNumber, limitNumber, { userId, placeId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un descubrimiento por ID' })
  findOne(@Param('id') id: string) {
    return this.discoveriesService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un descubrimiento' })
  remove(@Param('id') id: string) {
    return this.discoveriesService.remove(id);
  }
}
