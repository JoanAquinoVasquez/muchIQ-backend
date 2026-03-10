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
import { RefreshTokenDto } from './dto/refresh-token.dto';
import type { AuthResponse, AuthenticatedUser } from './interfaces/auth-response.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Registrar nuevo usuario (devuelve tokens, auto-login)' })
    @ApiResponse({ status: 201, description: 'Usuario creado y tokens retornados' })
    @ApiResponse({ status: 409, description: 'El email ya está en uso' })
    async register(@Body() dto: RegisterDto): Promise<AuthResponse> {
        return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Iniciar sesión — devuelve access_token (15m) y refresh_token (7d)' })
    @ApiResponse({ status: 200, description: 'Tokens retornados' })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
    async login(@Body() dto: LoginDto): Promise<AuthResponse> {
        const user = await this.authService.validateUser(dto.email, dto.password);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        return this.authService.login(user);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Obtener nuevo access_token usando el refresh_token' })
    @ApiResponse({ status: 200, description: 'Nuevo access_token retornado' })
    @ApiResponse({ status: 401, description: 'Refresh token inválido, expirado o revocado' })
    async refresh(@Body() dto: RefreshTokenDto): Promise<{ access_token: string }> {
        return this.authService.refresh(dto.refresh_token);
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Cerrar sesión — revoca el refresh_token' })
    @ApiResponse({ status: 204, description: 'Sesión cerrada' })
    async logout(@Body() dto: RefreshTokenDto): Promise<void> {
        return this.authService.logout(dto.refresh_token);
    }

    @Post('logout-all')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Cerrar sesión en todos los dispositivos' })
    @ApiResponse({ status: 204, description: 'Todos los tokens revocados' })
    @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
    async logoutAll(@CurrentUser() user: AuthenticatedUser): Promise<void> {
        return this.authService.logoutAll(user.userId);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Datos del usuario autenticado (extraídos del JWT)' })
    @ApiResponse({ status: 200, description: 'Datos del usuario' })
    @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
    getMe(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
        return user;
    }
}
