import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
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
import { PermissionsService } from '../../application/permissions/permissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { CreatePermissionActionDto } from './dto/create-permission-action.dto';
import { UpdatePermissionActionDto } from './dto/update-permission-action.dto';

@ApiTags('permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) {}

    @Get()
    @RequirePermission('config.permissions', 'view')
    @ApiOperation({ summary: 'Listar todas las acciones de permiso disponibles' })
    @ApiResponse({ status: 200, description: 'Lista de acciones de permiso' })
    findAll() {
        return this.permissionsService.findAll();
    }

    @Get(':id')
    @RequirePermission('config.permissions', 'view')
    @ApiOperation({ summary: 'Obtener acción de permiso por ID' })
    @ApiParam({ name: 'id', description: 'UUID de la acción' })
    @ApiResponse({ status: 200, description: 'Acción encontrada' })
    @ApiResponse({ status: 404, description: 'Acción no encontrada' })
    findOne(@Param('id') id: string) {
        return this.permissionsService.findById(id);
    }

    @Post()
    @RequirePermission('config.permissions', 'create')
    @ApiOperation({ summary: 'Crear una nueva acción de permiso' })
    @ApiResponse({ status: 201, description: 'Acción creada' })
    @ApiResponse({ status: 409, description: 'El código ya existe' })
    create(@Body() dto: CreatePermissionActionDto) {
        return this.permissionsService.create(dto);
    }

    @Patch(':id')
    @RequirePermission('config.permissions', 'edit')
    @ApiOperation({ summary: 'Actualizar una acción de permiso' })
    @ApiParam({ name: 'id', description: 'UUID de la acción' })
    @ApiResponse({ status: 200, description: 'Acción actualizada' })
    update(@Param('id') id: string, @Body() dto: UpdatePermissionActionDto) {
        return this.permissionsService.update(id, dto);
    }

    @Delete(':id')
    @RequirePermission('config.permissions', 'delete')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar una acción de permiso (hard delete — verificar que no esté en uso)' })
    @ApiParam({ name: 'id', description: 'UUID de la acción' })
    @ApiResponse({ status: 204, description: 'Acción eliminada' })
    remove(@Param('id') id: string) {
        return this.permissionsService.remove(id);
    }
}
