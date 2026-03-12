import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IUserRepository } from '../../domain/users/user.repository';
import { User } from '../../domain/users/user.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
    return user ? new User(user as unknown as Partial<User>) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
    return user ? new User(user as unknown as Partial<User>) : null;
  }

  async create(data: Partial<User>): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email!,
        password: data.password!,
        name: data.name || null,
        role: {
          connect: { name: 'EXPLORER' },
        },
        points: data.points || 0,
        totalExp: data.totalExp || 0,
        profile: (data.profile as Prisma.InputJsonValue) || Prisma.DbNull,
      },
      include: { role: true },
    });
    return new User(user as unknown as Partial<User>);
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
        profile: data.profile as Prisma.InputJsonValue,
      },
      include: { role: true },
    });
    return new User(user as unknown as Partial<User>);
  }
}
