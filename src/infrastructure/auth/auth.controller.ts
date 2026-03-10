import {
    Controller,
    Post,
    Get,
    Body,
    UseGuards,
    HttpCode,
    HttpStatus,
    UnauthorizedException,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from '../../application/auth/auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
// Las interfaces deben importarse como 'import type' cuando se usan en firmas decoradas
// (isolatedModules + emitDecoratorMetadata)
import type { AuthResponse, AuthenticatedUser } from './interfaces/auth-response.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Registrar nuevo usuario (explorer por defecto)' })
    @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
    @ApiResponse({ status: 409, description: 'El email ya está en uso' })
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Iniciar sesión y obtener JWT' })
    @ApiResponse({ status: 200, description: 'Token JWT retornado' })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
    async login(@Body() dto: LoginDto): Promise<AuthResponse> {
        const user = await this.authService.validateUser(dto.email, dto.password);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        return this.authService.login(user);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener datos del usuario autenticado (desde JWT)' })
    @ApiResponse({ status: 200, description: 'Datos del usuario autenticado' })
    @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
    getMe(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
        return user;
    }
}
