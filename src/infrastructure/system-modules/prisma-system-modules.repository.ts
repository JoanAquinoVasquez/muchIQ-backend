import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SystemModule } from '../../domain/system-modules/system-module.entity';
import {
    ISystemModuleRepository,
    SystemModuleFilterOptions,
    CreateSystemModuleInput,
    UpdateSystemModuleInput,
} from '../../domain/system-modules/system-module.repository';

// Include estándar: padre e hijos de primer nivel
const WITH_RELATIONS = {
    parent: true,
    children: {
        where: { isActive: true },
        orderBy: { order: 'asc' as const },
    },
} satisfies Prisma.ModuleInclude;

@Injectable()
export class PrismaSystemModuleRepository implements ISystemModuleRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(
        options: SystemModuleFilterOptions,
    ): Promise<{ data: SystemModule[]; total: number }> {
        const { page = 1, limit = 20, isActive, search, parentId } = options;
        const skip = (page - 1) * limit;

        const where: Prisma.ModuleWhereInput = {};
        if (isActive !== undefined) where.isActive = isActive;
        if (parentId !== undefined) where.parentId = parentId; // null = raíces, uuid = hijos
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [rows, total] = await Promise.all([
            this.prisma.module.findMany({
                where,
                include: WITH_RELATIONS,
                skip,
                take: limit,
                orderBy: [{ order: 'asc' }, { name: 'asc' }],
            }),
            this.prisma.module.count({ where }),
        ]);

        return {
            data: rows.map((r) => new SystemModule(r as unknown as SystemModule)),
            total,
        };
    }

    async findById(id: string): Promise<SystemModule | null> {
        const mod = await this.prisma.module.findUnique({
            where: { id },
            include: WITH_RELATIONS,
        });
        return mod ? new SystemModule(mod as unknown as SystemModule) : null;
    }

    async findByCode(code: string): Promise<SystemModule | null> {
        const mod = await this.prisma.module.findUnique({ where: { code } });
        return mod ? new SystemModule(mod) : null;
    }

    async create(data: CreateSystemModuleInput): Promise<SystemModule> {
        const mod = await this.prisma.module.create({
            data,
            include: WITH_RELATIONS,
        });
        return new SystemModule(mod as unknown as SystemModule);
    }

    async update(id: string, data: UpdateSystemModuleInput): Promise<SystemModule> {
        const mod = await this.prisma.module.update({
            where: { id },
            data,
            include: WITH_RELATIONS,
        });
        return new SystemModule(mod as unknown as SystemModule);
    }

    async deactivate(id: string): Promise<SystemModule> {
        const mod = await this.prisma.module.update({
            where: { id },
            data: { isActive: false },
            include: WITH_RELATIONS,
        });
        return new SystemModule(mod as unknown as SystemModule);
    }
}
