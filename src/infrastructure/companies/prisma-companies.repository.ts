import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Company } from '../../domain/commerce/company.entity';
import {
    ICompanyRepository,
    CompanyFilterOptions,
    CreateCompanyInput,
    UpdateCompanyInput,
} from '../../domain/commerce/company.repository';

@Injectable()
export class PrismaCompanyRepository implements ICompanyRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(options: CompanyFilterOptions): Promise<{ data: Company[]; total: number }> {
        const { page = 1, limit = 20, isActive, search, ownerId } = options;
        const skip = (page - 1) * limit;

        const where: Prisma.CompanyWhereInput = {};
        if (isActive !== undefined) where.isActive = isActive;
        if (ownerId) where.ownerId = ownerId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { ruc: { contains: search } },
            ];
        }

        const [rows, total] = await Promise.all([
            this.prisma.company.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
            }),
            this.prisma.company.count({ where }),
        ]);

        return { data: rows.map((r) => new Company(r)), total };
    }

    async findById(id: string): Promise<Company | null> {
        const row = await this.prisma.company.findUnique({ where: { id } });
        return row ? new Company(row) : null;
    }

    async findByRuc(ruc: string): Promise<Company | null> {
        const row = await this.prisma.company.findUnique({ where: { ruc } });
        return row ? new Company(row) : null;
    }

    async create(data: CreateCompanyInput): Promise<Company> {
        const row = await this.prisma.company.create({ data });
        return new Company(row);
    }

    async update(id: string, data: UpdateCompanyInput): Promise<Company> {
        const row = await this.prisma.company.update({ where: { id }, data });
        return new Company(row);
    }

    async deactivate(id: string): Promise<Company> {
        const row = await this.prisma.company.update({
            where: { id },
            data: { isActive: false },
        });
        return new Company(row);
    }
}
