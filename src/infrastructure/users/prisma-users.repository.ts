import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IUserRepository } from '../../domain/users/user.repository';
import { User, UserRole } from '../../domain/users/user.entity';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        return user ? new User({ ...user, role: user.role as UserRole }) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        return user ? new User({ ...user, role: user.role as UserRole }) : null;
    }

    async create(data: Partial<User>): Promise<User> {
        const user = await this.prisma.user.create({
            data: {
                email: data.email!,
                password: data.password!,
                name: data.name,
                role: data.role as any || 'EXPLORER',
                points: data.points || 0,
                totalExp: data.totalExp || 0,
            },
        });
        return new User({ ...user, role: user.role as UserRole });
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                email: data.email,
                name: data.name,
                role: data.role as any,
                points: data.points,
                totalExp: data.totalExp,
            },
        });
        return new User({ ...user, role: user.role as UserRole });
    }
}
