import {
    Injectable,
    Inject,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { SystemModule } from '../../domain/system-modules/system-module.entity';
import {
    ISystemModuleRepository,
    SystemModuleFilterOptions,
    CreateSystemModuleInput,
    UpdateSystemModuleInput,
} from '../../domain/system-modules/system-module.repository';
import type { PaginatedResult } from '../../infrastructure/common/interfaces/paginated-result.interface';

@Injectable()
export class SystemModulesService {
    constructor(
        @Inject(ISystemModuleRepository)
        private readonly moduleRepo: ISystemModuleRepository,
    ) {}

    async findAll(options: SystemModuleFilterOptions): Promise<PaginatedResult<SystemModule>> {
        const page = options.page ?? 1;
        const limit = options.limit ?? 20;
        const { data, total } = await this.moduleRepo.findAll({ ...options, page, limit });
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findById(id: string): Promise<SystemModule> {
        const mod = await this.moduleRepo.findById(id);
        if (!mod) throw new NotFoundException(`Módulo '${id}' no encontrado`);
        return mod;
    }

    async create(data: CreateSystemModuleInput): Promise<SystemModule> {
        const existing = await this.moduleRepo.findByCode(data.code);
        if (existing) {
            throw new ConflictException(`Ya existe un módulo con el código '${data.code}'`);
        }
        // Verificar que el padre existe si se especifica
        if (data.parentId) {
            await this.findById(data.parentId);
        }
        return this.moduleRepo.create(data);
    }

    async update(id: string, data: UpdateSystemModuleInput): Promise<SystemModule> {
        await this.findById(id);

        if (data.code) {
            const existing = await this.moduleRepo.findByCode(data.code);
            if (existing && existing.id !== id) {
                throw new ConflictException(`Ya existe un módulo con el código '${data.code}'`);
            }
        }

        // Verificar que el padre existe y no genera ciclo
        if (data.parentId) {
            if (data.parentId === id) {
                throw new ConflictException('Un módulo no puede ser su propio padre');
            }
            await this.findById(data.parentId);
        }

        return this.moduleRepo.update(id, data);
    }

    async deactivate(id: string): Promise<SystemModule> {
        await this.findById(id);
        return this.moduleRepo.deactivate(id);
    }
}
