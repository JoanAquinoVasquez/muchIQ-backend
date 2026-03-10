import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PermissionAction } from '../../domain/permissions/permission-action.entity';
import {
    IPermissionActionRepository,
    CreatePermissionActionInput,
    UpdatePermissionActionInput,
} from '../../domain/permissions/permission-action.repository';

@Injectable()
export class PrismaPermissionActionRepository implements IPermissionActionRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<PermissionAction[]> {
        const rows = await this.prisma.permissionAction.findMany({ orderBy: { name: 'asc' } });
        return rows.map((r) => new PermissionAction(r));
    }

    async findById(id: string): Promise<PermissionAction | null> {
        const row = await this.prisma.permissionAction.findUnique({ where: { id } });
        return row ? new PermissionAction(row) : null;
    }

    async findByCode(code: string): Promise<PermissionAction | null> {
        const row = await this.prisma.permissionAction.findUnique({ where: { code } });
        return row ? new PermissionAction(row) : null;
    }

    async create(data: CreatePermissionActionInput): Promise<PermissionAction> {
        const row = await this.prisma.permissionAction.create({ data });
        return new PermissionAction(row);
    }

    async update(id: string, data: UpdatePermissionActionInput): Promise<PermissionAction> {
        const row = await this.prisma.permissionAction.update({ where: { id }, data });
        return new PermissionAction(row);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.permissionAction.delete({ where: { id } });
    }
}
