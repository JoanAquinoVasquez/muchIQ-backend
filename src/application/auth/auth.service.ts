import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, createHash } from 'crypto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../../domain/users/user.entity';
import {
    IRefreshTokenRepository,
} from '../../domain/auth/refresh-token.repository';
import type {
    AuthResponse,
} from '../../infrastructure/auth/interfaces/auth-response.interface';
import type {
    JwtPayload,
} from '../../infrastructure/auth/interfaces/jwt-payload.interface';

// Input limpio para register — la application layer no depende de DTOs de infra
interface RegisterInput {
    email: string;
    password: string;
    name?: string;
}

type UserWithoutPassword = Omit<User, 'password'>;

const REFRESH_TOKEN_TTL_DAYS = 7;

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        @Inject(IRefreshTokenRepository)
        private readonly refreshTokenRepo: IRefreshTokenRepository,
    ) {}

    async register(data: RegisterInput): Promise<AuthResponse> {
        const existing = await this.usersService.findByEmail(data.email);
        if (existing) {
            throw new ConflictException('Ya existe un usuario con ese email');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.usersService.create({
            ...data,
            password: hashedPassword,
        });

        // Auto-login tras registro para no obligar al cliente a hacer dos llamadas
        const { password: _pw, ...userWithoutPassword } = user;
        return this.login(userWithoutPassword as UserWithoutPassword);
    }

    async validateUser(email: string, pass: string): Promise<UserWithoutPassword | null> {
        const user = await this.usersService.findByEmail(email);
        if (!user || !user.password) return null;

        const match = await bcrypt.compare(pass, user.password);
        if (!match) return null;

        const { password: _pw, ...result } = user;
        return result as UserWithoutPassword;
    }

    async login(user: UserWithoutPassword): Promise<AuthResponse> {
        const roleName = user.role?.name ?? 'EXPLORER';

        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            role: roleName,
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.sign(payload),
            this.createRefreshToken(user.id),
        ]);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name ?? null,
                role: roleName,
            },
        };
    }

    async refresh(rawToken: string): Promise<{ access_token: string }> {
        const hash = this.hashToken(rawToken);
        const stored = await this.refreshTokenRepo.findByToken(hash);

        if (!stored) {
            throw new UnauthorizedException('Refresh token inválido');
        }
        if (stored.revokedAt) {
            throw new UnauthorizedException('Refresh token revocado');
        }
        if (stored.expiresAt < new Date()) {
            throw new UnauthorizedException('Refresh token expirado');
        }

        const roleName = stored.user?.role?.name ?? 'EXPLORER';
        const payload: JwtPayload = {
            sub: stored.userId,
            // user siempre existe por la constraint onDelete: Cascade
            email: stored.user!.email,
            role: roleName,
        };

        return { access_token: this.jwtService.sign(payload) };
    }

    async logout(rawToken: string): Promise<void> {
        await this.refreshTokenRepo.revoke(this.hashToken(rawToken));
    }

    // Revoca todos los tokens del usuario — útil para "cerrar sesión en todos los dispositivos"
    async logoutAll(userId: string): Promise<void> {
        await this.refreshTokenRepo.revokeAllForUser(userId);
    }

    private async createRefreshToken(userId: string): Promise<string> {
        const rawToken = randomBytes(40).toString('hex');
        const tokenHash = this.hashToken(rawToken);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS);

        await this.refreshTokenRepo.create({ token: tokenHash, userId, expiresAt });

        return rawToken; // nunca guardamos el token plano, solo el hash
    }

    // SHA-256 determinístico: permite buscar por hash en DB sin bcrypt
    private hashToken(token: string): string {
        return createHash('sha256').update(token).digest('hex');
    }
}
