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
import { RolesService } from '../../application/roles/roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { FilterRolesDto } from './dto/filter-roles.dto';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Get()
    @RequirePermission('config.roles', 'view')
    @ApiOperation({ summary: 'Listar roles con paginación y filtros' })
    @ApiResponse({ status: 200, description: 'Lista paginada de roles' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'Sin permiso' })
    findAll(@Query() filter: FilterRolesDto) {
        return this.rolesService.findAll(filter);
    }

    @Get(':id')
    @RequirePermission('config.roles', 'view')
    @ApiOperation({ summary: 'Obtener un rol por ID' })
    @ApiParam({ name: 'id', description: 'UUID del rol' })
    @ApiResponse({ status: 200, description: 'Rol encontrado' })
    @ApiResponse({ status: 404, description: 'Rol no encontrado' })
    findOne(@Param('id') id: string) {
        return this.rolesService.findById(id);
    }

    @Post()
    @RequirePermission('config.roles', 'create')
    @ApiOperation({ summary: 'Crear un nuevo rol' })
    @ApiResponse({ status: 201, description: 'Rol creado' })
    @ApiResponse({ status: 409, description: 'Ya existe un rol con ese nombre' })
    create(@Body() dto: CreateRoleDto) {
        return this.rolesService.create(dto);
    }

    @Patch(':id')
    @RequirePermission('config.roles', 'edit')
    @ApiOperation({ summary: 'Actualizar un rol' })
    @ApiParam({ name: 'id', description: 'UUID del rol' })
    @ApiResponse({ status: 200, description: 'Rol actualizado' })
    @ApiResponse({ status: 404, description: 'Rol no encontrado' })
    update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
        return this.rolesService.update(id, dto);
    }

    @Delete(':id')
    @RequirePermission('config.roles', 'delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Desactivar un rol (soft delete — no se elimina de la BD)' })
    @ApiParam({ name: 'id', description: 'UUID del rol' })
    @ApiResponse({ status: 200, description: 'Rol desactivado' })
    @ApiResponse({ status: 404, description: 'Rol no encontrado' })
    deactivate(@Param('id') id: string) {
        return this.rolesService.deactivate(id);
    }
}
