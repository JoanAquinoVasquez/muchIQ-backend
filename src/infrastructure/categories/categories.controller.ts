import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
} from '@nestjs/swagger';
import { CategoriesService } from '../../application/categories/categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FilterCategoriesDto } from './dto/filter-categories.dto';

@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    @RequirePermission('categories', 'view')
    @ApiOperation({ summary: 'Listar categorías con paginación y filtros' })
    @ApiResponse({ status: 200, description: 'Lista paginada de categorías' })
    findAll(@Query() filter: FilterCategoriesDto) {
        return this.categoriesService.findAll(filter);
    }

    @Get(':id')
    @RequirePermission('categories', 'view')
    @ApiOperation({ summary: 'Obtener categoría por ID' })
    @ApiParam({ name: 'id', description: 'UUID de la categoría' })
    @ApiResponse({ status: 200, description: 'Categoría encontrada' })
    @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
    findOne(@Param('id') id: string) {
        return this.categoriesService.findById(id);
    }

    @Post()
    @RequirePermission('categories', 'create')
    @ApiOperation({ summary: 'Crear una nueva categoría' })
    @ApiResponse({ status: 201, description: 'Categoría creada' })
    @ApiResponse({ status: 409, description: 'El nombre ya existe' })
    create(@Body() dto: CreateCategoryDto) {
        return this.categoriesService.create(dto);
    }

    @Patch(':id')
    @RequirePermission('categories', 'edit')
    @ApiOperation({ summary: 'Actualizar una categoría' })
    @ApiParam({ name: 'id', description: 'UUID de la categoría' })
    @ApiResponse({ status: 200, description: 'Categoría actualizada' })
    @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
    update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
        return this.categoriesService.update(id, dto);
    }

    @Delete(':id')
    @RequirePermission('categories', 'delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Desactivar una categoría (soft delete)' })
    @ApiParam({ name: 'id', description: 'UUID de la categoría' })
    @ApiResponse({ status: 200, description: 'Categoría desactivada' })
    @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
    deactivate(@Param('id') id: string) {
        return this.categoriesService.deactivate(id);
    }
}
