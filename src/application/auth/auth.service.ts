import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/users/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(data: any): Promise<any> {
        const existingUser = await this.usersService.findByEmail(data.email);
        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.usersService.create({
            ...data,
            password: hashedPassword,
        });

        const { password, ...result } = user;
        return result;
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password!))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const roleName = user.role?.name || 'EXPLORER';
        const payload = { email: user.email, sub: user.id, role: roleName };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: roleName,
            },
        };
    }
}
