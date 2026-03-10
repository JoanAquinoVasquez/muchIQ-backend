import {
    Injectable,
    Inject,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { PermissionAction } from '../../domain/permissions/permission-action.entity';
import {
    IPermissionActionRepository,
    CreatePermissionActionInput,
    UpdatePermissionActionInput,
} from '../../domain/permissions/permission-action.repository';

@Injectable()
export class PermissionsService {
    constructor(
        @Inject(IPermissionActionRepository)
        private readonly permRepo: IPermissionActionRepository,
    ) {}

    findAll(): Promise<PermissionAction[]> {
        return this.permRepo.findAll();
    }

    async findById(id: string): Promise<PermissionAction> {
        const perm = await this.permRepo.findById(id);
        if (!perm) throw new NotFoundException(`Acción de permiso '${id}' no encontrada`);
        return perm;
    }

    async create(data: CreatePermissionActionInput): Promise<PermissionAction> {
        const existing = await this.permRepo.findByCode(data.code);
        if (existing) throw new ConflictException(`Ya existe una acción con el código '${data.code}'`);
        return this.permRepo.create(data);
    }

    async update(id: string, data: UpdatePermissionActionInput): Promise<PermissionAction> {
        await this.findById(id);
        if (data.code) {
            const existing = await this.permRepo.findByCode(data.code);
            if (existing && existing.id !== id) {
                throw new ConflictException(`Ya existe una acción con el código '${data.code}'`);
            }
        }
        return this.permRepo.update(id, data);
    }

    async remove(id: string): Promise<void> {
        await this.findById(id);
        return this.permRepo.delete(id);
    }
}
