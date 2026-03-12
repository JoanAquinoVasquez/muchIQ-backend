import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { DishesService } from '../../application/dishes/dishes.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateDishDto } from './dto/create-dish.dto';

@ApiTags('dishes')
@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los platos regionales' })
  @ApiResponse({
    status: 200,
    description: 'Lista de platos devuelta con éxito',
  })
  async findAll() {
    return this.dishesService.getAllDishes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un plato por su ID' })
  async findOne(@Param('id') id: string) {
    return this.dishesService.getDishById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo plato regional' })
  async create(@Body() createDishDto: CreateDishDto) {
    return this.dishesService.createDish(createDishDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un plato regional' })
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.dishesService.updateDish(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar un plato regional' })
  async remove(@Param('id') id: string) {
    return this.dishesService.deleteDish(id);
  }
}
