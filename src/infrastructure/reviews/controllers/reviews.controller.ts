import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from '../../../application/reviews/services/reviews.service';
import { CreateReviewDto, UpdateReviewDto } from '../../../application/reviews/dto/review.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una nueva reseña para un lugar o ruta' })
  @ApiResponse({ status: 201, description: 'Review created successfully.' })
  create(@Body() createReviewDto: CreateReviewDto, @Request() req: any) {
    const userId = req.user.id;
    return this.reviewsService.create(userId, createReviewDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las reseñas con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'placeId', required: false, type: String })
  @ApiQuery({ name: 'routeId', required: false, type: String })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('userId') userId?: string,
    @Query('placeId') placeId?: string,
    @Query('routeId') routeId?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    
    return this.reviewsService.findAll(pageNumber, limitNumber, { userId, placeId, routeId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una reseña por ID' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una reseña' })
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una reseña' })
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
