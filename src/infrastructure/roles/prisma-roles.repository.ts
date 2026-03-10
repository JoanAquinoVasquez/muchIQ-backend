import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../../domain/roles/role.entity';
import {
    IRoleRepository,
    RoleFilterOptions,
    CreateRoleInput,
    UpdateRoleInput,
} from '../../domain/roles/role.repository';

@Injectable()
export class PrismaRoleRepository implements IRoleRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(options: RoleFilterOptions): Promise<{ data: Role[]; total: number }> {
        const { page = 1, limit = 20, isActive, search } = options;
        const skip = (page - 1) * limit;

        const where: Prisma.RoleWhereInput = {};
        if (isActive !== undefined) where.isActive = isActive;
        if (search) where.name = { contains: search, mode: 'insensitive' };

        const [rows, total] = await Promise.all([
            this.prisma.role.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
            }),
            this.prisma.role.count({ where }),
        ]);

        return { data: rows.map((r) => new Role(r)), total };
    }

    async findById(id: string): Promise<Role | null> {
        const role = await this.prisma.role.findUnique({ where: { id } });
        return role ? new Role(role) : null;
    }

    async findByName(name: string): Promise<Role | null> {
        const role = await this.prisma.role.findUnique({ where: { name } });
        return role ? new Role(role) : null;
    }

    async create(data: CreateRoleInput): Promise<Role> {
        const role = await this.prisma.role.create({ data });
        return new Role(role);
    }

    async update(id: string, data: UpdateRoleInput): Promise<Role> {
        const role = await this.prisma.role.update({ where: { id }, data });
        return new Role(role);
    }

    async deactivate(id: string): Promise<Role> {
        const role = await this.prisma.role.update({
            where: { id },
            data: { isActive: false },
        });
        return new Role(role);
    }
}
