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
import { CompaniesService } from '../../application/companies/companies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FilterCompaniesDto } from './dto/filter-companies.dto';
import type { AuthenticatedUser } from '../auth/interfaces/auth-response.interface';

@ApiTags('companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) {}

    @Get()
    @RequirePermission('companies', 'view')
    @ApiOperation({ summary: 'Listar empresas. PARTNER solo ve las suyas, ADMIN ve todas.' })
    @ApiResponse({ status: 200, description: 'Lista paginada de empresas' })
    findAll(
        @Query() filter: FilterCompaniesDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.companiesService.findAll(filter, user.userId, user.role);
    }

    @Get(':id')
    @RequirePermission('companies', 'view')
    @ApiOperation({ summary: 'Obtener empresa por ID' })
    @ApiParam({ name: 'id', description: 'UUID de la empresa' })
    @ApiResponse({ status: 200, description: 'Empresa encontrada' })
    @ApiResponse({ status: 403, description: 'Sin acceso a esta empresa' })
    @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
    findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
        return this.companiesService.findById(id, user.userId, user.role);
    }

    @Post()
    @RequirePermission('companies', 'create')
    @ApiOperation({ summary: 'Crear empresa. El dueño es el usuario autenticado.' })
    @ApiResponse({ status: 201, description: 'Empresa creada' })
    @ApiResponse({ status: 409, description: 'RUC ya registrado' })
    create(@Body() dto: CreateCompanyDto, @CurrentUser() user: AuthenticatedUser) {
        return this.companiesService.create({ ...dto, ownerId: user.userId });
    }

    @Patch(':id')
    @RequirePermission('companies', 'edit')
    @ApiOperation({ summary: 'Actualizar empresa' })
    @ApiParam({ name: 'id', description: 'UUID de la empresa' })
    @ApiResponse({ status: 200, description: 'Empresa actualizada' })
    @ApiResponse({ status: 403, description: 'Sin acceso a esta empresa' })
    update(
        @Param('id') id: string,
        @Body() dto: UpdateCompanyDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.companiesService.update(id, dto, user.userId, user.role);
    }

    @Delete(':id')
    @RequirePermission('companies', 'delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Desactivar empresa (soft delete)' })
    @ApiParam({ name: 'id', description: 'UUID de la empresa' })
    @ApiResponse({ status: 200, description: 'Empresa desactivada' })
    @ApiResponse({ status: 403, description: 'Sin acceso a esta empresa' })
    deactivate(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
        return this.companiesService.deactivate(id, user.userId, user.role);
    }
}
