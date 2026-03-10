import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../interfaces/auth-response.interface';
import { PERMISSION_KEY, RequiredPermission } from '../decorators/require-permission.decorator';

// Valida que el rol del usuario tenga el permiso específico sobre el módulo solicitado.
// Debe usarse siempre junto con JwtAuthGuard.
@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly prisma: PrismaService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const required = this.reflector.get<RequiredPermission | undefined>(
            PERMISSION_KEY,
            context.getHandler(),
        );

        // Endpoint sin @RequirePermission → libre (solo requiere JWT si tiene JwtAuthGuard)
        if (!required) return true;

        const request = context
            .switchToHttp()
            .getRequest<{ user: AuthenticatedUser }>();

        const user = request.user;
        if (!user) throw new UnauthorizedException('No autenticado');

        // Busca si el rol del usuario tiene ese módulo asignado con el permiso requerido
        const roleModule = await this.prisma.roleModule.findFirst({
            where: {
                role: { name: user.role },
                module: { code: required.moduleCode },
            },
            include: {
                permissions: {
                    include: { permissionAction: true },
                },
            },
        });

        if (!roleModule) {
            throw new ForbiddenException(
                `El rol ${user.role} no tiene acceso al módulo '${required.moduleCode}'`,
            );
        }

        const hasPermission = roleModule.permissions.some(
            (p) => p.permissionAction.code === required.permissionCode,
        );

        if (!hasPermission) {
            throw new ForbiddenException(
                `El rol ${user.role} no tiene el permiso '${required.permissionCode}' en '${required.moduleCode}'`,
            );
        }

        return true;
    }
}
