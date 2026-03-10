import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IUserRepository } from '../../domain/users/user.repository';
import { User } from '../../domain/users/user.entity';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ 
            where: { id },
            include: { role: true }
        });
        return user ? new User(user as any) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ 
            where: { email },
            include: { role: true }
        });
        return user ? new User(user as any) : null;
    }

    async create(data: Partial<User>): Promise<User> {
        const user = await this.prisma.user.create({
            data: {
                email: data.email!,
                password: data.password!,
                name: data.name || null,
                role: {
                  connect: { name: 'EXPLORER' } // Default role name
                },
                points: data.points || 0,
                totalExp: data.totalExp || 0,
                profile: data.profile || {},
            },
            include: { role: true }
        });
        return new User(user as any);
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                email: data.email,
                password: data.password,
                name: data.name,
                points: data.points,
                totalExp: data.totalExp,
                profile: data.profile,
            },
            include: { role: true }
        });
        return new User(user as any);
    }
}
