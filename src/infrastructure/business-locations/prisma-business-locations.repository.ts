import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessLocation } from '../../domain/commerce/business-location.entity';
import {
    IBusinessLocationRepository,
    BusinessLocationFilterOptions,
    CreateBusinessLocationInput,
    UpdateBusinessLocationInput,
} from '../../domain/commerce/business-location.repository';

@Injectable()
export class PrismaBusinessLocationRepository implements IBusinessLocationRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(
        options: BusinessLocationFilterOptions,
    ): Promise<{ data: BusinessLocation[]; total: number }> {
        const { page = 1, limit = 20, isActive, search, companyId } = options;
        const skip = (page - 1) * limit;

        const where: Prisma.BusinessLocationWhereInput = {};
        if (isActive !== undefined) where.isActive = isActive;
        if (companyId) where.companyId = companyId;
        if (search) where.name = { contains: search, mode: 'insensitive' };

        const [rows, total] = await Promise.all([
            this.prisma.businessLocation.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
            }),
            this.prisma.businessLocation.count({ where }),
        ]);

        return { data: rows.map((r) => new BusinessLocation(r)), total };
    }

    async findById(id: string): Promise<BusinessLocation | null> {
        const row = await this.prisma.businessLocation.findUnique({ where: { id } });
        return row ? new BusinessLocation(row) : null;
    }

    async create(data: CreateBusinessLocationInput): Promise<BusinessLocation> {
        const row = await this.prisma.businessLocation.create({ data });
        return new BusinessLocation(row);
    }

    async update(id: string, data: UpdateBusinessLocationInput): Promise<BusinessLocation> {
        const row = await this.prisma.businessLocation.update({ where: { id }, data });
        return new BusinessLocation(row);
    }

    async deactivate(id: string): Promise<BusinessLocation> {
        const row = await this.prisma.businessLocation.update({
            where: { id },
            data: { isActive: false },
        });
        return new BusinessLocation(row);
    }
}
