import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../../domain/users/user.entity';
import { RegisterDto } from '../../infrastructure/auth/dto/register.dto';
import { AuthResponse } from '../../infrastructure/auth/interfaces/auth-response.interface';
import { JwtPayload } from '../../infrastructure/auth/interfaces/jwt-payload.interface';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register(data: RegisterDto): Promise<UserWithoutPassword> {
        const existing = await this.usersService.findByEmail(data.email);
        if (existing) {
            throw new ConflictException('Ya existe un usuario con ese email');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.usersService.create({
            ...data,
            password: hashedPassword,
        });

        const { password: _pw, ...result } = user;
        return result as UserWithoutPassword;
    }

    async validateUser(email: string, pass: string): Promise<UserWithoutPassword | null> {
        const user = await this.usersService.findByEmail(email);
        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(pass, user.password);
        if (!passwordMatch) return null;

        const { password: _pw, ...result } = user;
        return result as UserWithoutPassword;
    }

    login(user: UserWithoutPassword): AuthResponse {
        const roleName = user.role?.name ?? 'EXPLORER';

        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            role: roleName,
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name ?? null,
                role: roleName,
            },
        };
    }
}
