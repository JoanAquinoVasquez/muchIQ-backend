import {
    Injectable,
    Inject,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { Role } from '../../domain/roles/role.entity';
import {
    IRoleRepository,
    RoleFilterOptions,
    CreateRoleInput,
    UpdateRoleInput,
} from '../../domain/roles/role.repository';
import type { PaginatedResult } from '../../infrastructure/common/interfaces/paginated-result.interface';

@Injectable()
export class RolesService {
    constructor(
        @Inject(IRoleRepository)
        private readonly roleRepo: IRoleRepository,
    ) {}

    async findAll(options: RoleFilterOptions): Promise<PaginatedResult<Role>> {
        const page = options.page ?? 1;
        const limit = options.limit ?? 20;
        const { data, total } = await this.roleRepo.findAll({ ...options, page, limit });
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findById(id: string): Promise<Role> {
        const role = await this.roleRepo.findById(id);
        if (!role) throw new NotFoundException(`Rol '${id}' no encontrado`);
        return role;
    }

    async create(data: CreateRoleInput): Promise<Role> {
        const existing = await this.roleRepo.findByName(data.name);
        if (existing) {
            throw new ConflictException(`Ya existe un rol con el nombre '${data.name}'`);
        }
        return this.roleRepo.create(data);
    }

    async update(id: string, data: UpdateRoleInput): Promise<Role> {
        await this.findById(id);

        // Evitar nombre duplicado en otro rol
        if (data.name) {
            const existing = await this.roleRepo.findByName(data.name);
            if (existing && existing.id !== id) {
                throw new ConflictException(`Ya existe un rol con el nombre '${data.name}'`);
            }
        }

        return this.roleRepo.update(id, data);
    }

    async deactivate(id: string): Promise<Role> {
        await this.findById(id);
        return this.roleRepo.deactivate(id);
    }
}
