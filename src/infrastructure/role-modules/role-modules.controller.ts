import {
    Controller,
    Get,
    Post,
    Delete,
    Put,
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
import { RoleModulesService } from '../../application/role-modules/role-modules.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { AssignModuleToRoleDto } from './dto/assign-module-to-role.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { SyncPermissionsDto } from './dto/sync-permissions.dto';

@ApiTags('role-modules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles/:roleId/modules')
export class RoleModulesController {
    constructor(private readonly roleModulesService: RoleModulesService) {}

    @Get()
    @RequirePermission('config.roles', 'view')
    @ApiOperation({ summary: 'Ver todos los módulos asignados a un rol (con sus permisos)' })
    @ApiParam({ name: 'roleId', description: 'UUID del rol' })
    @ApiResponse({ status: 200, description: 'Módulos del rol con sus permisos' })
    getModulesByRole(@Param('roleId') roleId: string) {
        return this.roleModulesService.getModulesByRole(roleId);
    }

    @Post()
    @RequirePermission('config.roles', 'edit')
    @ApiOperation({ summary: 'Asignar un módulo a un rol' })
    @ApiParam({ name: 'roleId', description: 'UUID del rol' })
    @ApiResponse({ status: 201, description: 'Módulo asignado al rol' })
    @ApiResponse({ status: 409, description: 'El módulo ya está asignado al rol' })
    assignModule(
        @Param('roleId') roleId: string,
        @Body() dto: AssignModuleToRoleDto,
    ) {
        return this.roleModulesService.assignModule(roleId, dto.moduleId);
    }

    @Delete(':moduleId')
    @RequirePermission('config.roles', 'edit')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Quitar un módulo de un rol (y todos sus permisos)' })
    @ApiParam({ name: 'roleId', description: 'UUID del rol' })
    @ApiParam({ name: 'moduleId', description: 'UUID del módulo' })
    @ApiResponse({ status: 204, description: 'Módulo removido del rol' })
    removeModule(
        @Param('roleId') roleId: string,
        @Param('moduleId') moduleId: string,
    ) {
        return this.roleModulesService.removeModule(roleId, moduleId);
    }

    @Post(':moduleId/permissions')
    @RequirePermission('config.roles', 'edit')
    @ApiOperation({ summary: 'Agregar un permiso individual a un rol+módulo' })
    @ApiParam({ name: 'roleId', description: 'UUID del rol' })
    @ApiParam({ name: 'moduleId', description: 'UUID del módulo' })
    @ApiResponse({ status: 201, description: 'Permiso agregado' })
    assignPermission(
        @Param('roleId') roleId: string,
        @Param('moduleId') moduleId: string,
        @Body() dto: AssignPermissionDto,
    ) {
        return this.roleModulesService.assignPermission(roleId, moduleId, dto.permissionActionId);
    }

    @Delete(':moduleId/permissions/:permissionActionId')
    @RequirePermission('config.roles', 'edit')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Quitar un permiso individual de un rol+módulo' })
    @ApiParam({ name: 'roleId', description: 'UUID del rol' })
    @ApiParam({ name: 'moduleId', description: 'UUID del módulo' })
    @ApiParam({ name: 'permissionActionId', description: 'UUID de la acción de permiso' })
    @ApiResponse({ status: 204, description: 'Permiso removido' })
    removePermission(
        @Param('roleId') roleId: string,
        @Param('moduleId') moduleId: string,
        @Param('permissionActionId') permissionActionId: string,
    ) {
        return this.roleModulesService.removePermission(roleId, moduleId, permissionActionId);
    }

    @Put(':moduleId/permissions')
    @RequirePermission('config.roles', 'edit')
    @ApiOperation({ summary: 'Sincronizar permisos de un rol+módulo (reemplaza todos de una vez)' })
    @ApiParam({ name: 'roleId', description: 'UUID del rol' })
    @ApiParam({ name: 'moduleId', description: 'UUID del módulo' })
    @ApiResponse({ status: 200, description: 'Permisos sincronizados' })
    syncPermissions(
        @Param('roleId') roleId: string,
        @Param('moduleId') moduleId: string,
        @Body() dto: SyncPermissionsDto,
    ) {
        return this.roleModulesService.syncPermissions(roleId, moduleId, dto.permissionActionIds);
    }
}
