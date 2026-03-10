import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '../../domain/taxonomy/category.entity';
import {
    ICategoryRepository,
    CategoryFilterOptions,
    CreateCategoryInput,
    UpdateCategoryInput,
} from '../../domain/taxonomy/category.repository';

@Injectable()
export class PrismaCategoryRepository implements ICategoryRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(options: CategoryFilterOptions): Promise<{ data: Category[]; total: number }> {
        const { page = 1, limit = 20, isActive, search } = options;
        const skip = (page - 1) * limit;

        const where: Prisma.CategoryWhereInput = {};
        if (isActive !== undefined) where.isActive = isActive;
        if (search) where.name = { contains: search, mode: 'insensitive' };

        const [rows, total] = await Promise.all([
            this.prisma.category.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
            }),
            this.prisma.category.count({ where }),
        ]);

        return { data: rows.map((r) => new Category(r)), total };
    }

    async findById(id: string): Promise<Category | null> {
        const row = await this.prisma.category.findUnique({ where: { id } });
        return row ? new Category(row) : null;
    }

    async findByName(name: string): Promise<Category | null> {
        const row = await this.prisma.category.findUnique({ where: { name } });
        return row ? new Category(row) : null;
    }

    async create(data: CreateCategoryInput): Promise<Category> {
        const row = await this.prisma.category.create({ data });
        return new Category(row);
    }

    async update(id: string, data: UpdateCategoryInput): Promise<Category> {
        const row = await this.prisma.category.update({ where: { id }, data });
        return new Category(row);
    }

    async deactivate(id: string): Promise<Category> {
        const row = await this.prisma.category.update({
            where: { id },
            data: { isActive: false },
        });
        return new Category(row);
    }
}
