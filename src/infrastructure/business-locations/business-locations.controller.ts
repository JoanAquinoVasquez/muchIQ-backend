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
import { BusinessLocationsService } from '../../application/business-locations/business-locations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateBusinessLocationDto } from './dto/create-business-location.dto';
import { UpdateBusinessLocationDto } from './dto/update-business-location.dto';
import { FilterBusinessLocationsDto } from './dto/filter-business-locations.dto';
import type { AuthenticatedUser } from '../auth/interfaces/auth-response.interface';

@ApiTags('business-locations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('companies/:companyId/locations')
export class BusinessLocationsController {
    constructor(private readonly locationsService: BusinessLocationsService) {}

    @Get()
    @RequirePermission('companies', 'view')
    @ApiOperation({ summary: 'Listar locales de una empresa' })
    @ApiParam({ name: 'companyId', description: 'UUID de la empresa' })
    @ApiResponse({ status: 200, description: 'Lista paginada de locales' })
    @ApiResponse({ status: 403, description: 'Sin acceso a esta empresa' })
    findAll(
        @Param('companyId') companyId: string,
        @Query() filter: FilterBusinessLocationsDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.locationsService.findAll(companyId, filter, user.userId, user.role);
    }

    @Get(':id')
    @RequirePermission('companies', 'view')
    @ApiOperation({ summary: 'Obtener local por ID' })
    @ApiParam({ name: 'companyId', description: 'UUID de la empresa' })
    @ApiParam({ name: 'id', description: 'UUID del local' })
    @ApiResponse({ status: 200, description: 'Local encontrado' })
    @ApiResponse({ status: 404, description: 'Local no encontrado o no pertenece a la empresa' })
    findOne(
        @Param('companyId') companyId: string,
        @Param('id') id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.locationsService.findById(id, companyId, user.userId, user.role);
    }

    @Post()
    @RequirePermission('companies', 'edit')
    @ApiOperation({ summary: 'Crear local para una empresa' })
    @ApiParam({ name: 'companyId', description: 'UUID de la empresa' })
    @ApiResponse({ status: 201, description: 'Local creado' })
    @ApiResponse({ status: 403, description: 'Sin acceso a esta empresa' })
    create(
        @Param('companyId') companyId: string,
        @Body() dto: CreateBusinessLocationDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.locationsService.create(companyId, dto, user.userId, user.role);
    }

    @Patch(':id')
    @RequirePermission('companies', 'edit')
    @ApiOperation({ summary: 'Actualizar local' })
    @ApiParam({ name: 'companyId', description: 'UUID de la empresa' })
    @ApiParam({ name: 'id', description: 'UUID del local' })
    @ApiResponse({ status: 200, description: 'Local actualizado' })
    update(
        @Param('companyId') companyId: string,
        @Param('id') id: string,
        @Body() dto: UpdateBusinessLocationDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.locationsService.update(id, companyId, dto, user.userId, user.role);
    }

    @Delete(':id')
    @RequirePermission('companies', 'delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Desactivar local (soft delete)' })
    @ApiParam({ name: 'companyId', description: 'UUID de la empresa' })
    @ApiParam({ name: 'id', description: 'UUID del local' })
    @ApiResponse({ status: 200, description: 'Local desactivado' })
    deactivate(
        @Param('companyId') companyId: string,
        @Param('id') id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.locationsService.deactivate(id, companyId, user.userId, user.role);
    }
}
