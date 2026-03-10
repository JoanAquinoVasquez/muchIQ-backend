import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../../application/auth/auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PermissionsGuard } from './guards/permissions.guard';

// PrismaService lo provee PrismaModule (global), no hay que importarlo aquí
@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'muchiq-secret-key-2025',
            signOptions: { expiresIn: '1d' },
        }),
    ],
    providers: [AuthService, JwtStrategy, PermissionsGuard],
    controllers: [AuthController],
    exports: [AuthService, PermissionsGuard],
})
export class AuthModule {}
