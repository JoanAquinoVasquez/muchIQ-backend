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
import { SystemModulesService } from '../../application/system-modules/system-modules.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { CreateSystemModuleDto } from './dto/create-system-module.dto';
import { UpdateSystemModuleDto } from './dto/update-system-module.dto';
import { FilterSystemModulesDto } from './dto/filter-system-modules.dto';

@ApiTags('system-modules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system-modules')
export class SystemModulesController {
    constructor(private readonly systemModulesService: SystemModulesService) {}

    @Get()
    @RequirePermission('config.modulos', 'view')
    @ApiOperation({ summary: 'Listar módulos del sistema (soporta filtro por padre)' })
    @ApiResponse({ status: 200, description: 'Lista paginada de módulos' })
    @ApiResponse({ status: 403, description: 'Sin permiso' })
    findAll(@Query() filter: FilterSystemModulesDto) {
        return this.systemModulesService.findAll(filter);
    }

    @Get(':id')
    @RequirePermission('config.modulos', 'view')
    @ApiOperation({ summary: 'Obtener un módulo por ID (incluye padre e hijos activos)' })
    @ApiParam({ name: 'id', description: 'UUID del módulo' })
    @ApiResponse({ status: 200, description: 'Módulo encontrado' })
    @ApiResponse({ status: 404, description: 'Módulo no encontrado' })
    findOne(@Param('id') id: string) {
        return this.systemModulesService.findById(id);
    }

    @Post()
    @RequirePermission('config.modulos', 'create')
    @ApiOperation({ summary: 'Crear un módulo (opcionalmente con padre para jerarquía)' })
    @ApiResponse({ status: 201, description: 'Módulo creado' })
    @ApiResponse({ status: 409, description: 'El código ya existe' })
    create(@Body() dto: CreateSystemModuleDto) {
        return this.systemModulesService.create(dto);
    }

    @Patch(':id')
    @RequirePermission('config.modulos', 'edit')
    @ApiOperation({ summary: 'Actualizar un módulo' })
    @ApiParam({ name: 'id', description: 'UUID del módulo' })
    @ApiResponse({ status: 200, description: 'Módulo actualizado' })
    @ApiResponse({ status: 404, description: 'Módulo no encontrado' })
    update(@Param('id') id: string, @Body() dto: UpdateSystemModuleDto) {
        return this.systemModulesService.update(id, dto);
    }

    @Delete(':id')
    @RequirePermission('config.modulos', 'delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Desactivar un módulo (soft delete)' })
    @ApiParam({ name: 'id', description: 'UUID del módulo' })
    @ApiResponse({ status: 200, description: 'Módulo desactivado' })
    @ApiResponse({ status: 404, description: 'Módulo no encontrado' })
    deactivate(@Param('id') id: string) {
        return this.systemModulesService.deactivate(id);
    }
}
