import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../../application/auth/auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PermissionsGuard } from './guards/permissions.guard';
import { PrismaRefreshTokenRepository } from './prisma-refresh-token.repository';
import { IRefreshTokenRepository } from '../../domain/auth/refresh-token.repository';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'muchiq-secret-key-2025',
            signOptions: { expiresIn: '15m' }, // access token corto — el cliente usa refresh para renovar
        }),
    ],
    providers: [
        AuthService,
        JwtStrategy,
        PermissionsGuard,
        {
            provide: IRefreshTokenRepository,
            useClass: PrismaRefreshTokenRepository,
        },
    ],
    controllers: [AuthController],
    exports: [AuthService, PermissionsGuard],
})
export class AuthModule {}
