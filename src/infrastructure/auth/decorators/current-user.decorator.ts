import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../interfaces/auth-response.interface';

// Extrae el usuario autenticado del request (puesto ahí por JwtStrategy.validate)
export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
        const request = ctx.switchToHttp().getRequest<{ user: AuthenticatedUser }>();
        return request.user;
    },
);
