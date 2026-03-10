import {
    Injectable,
    Inject,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { Category } from '../../domain/taxonomy/category.entity';
import {
    ICategoryRepository,
    CategoryFilterOptions,
    CreateCategoryInput,
    UpdateCategoryInput,
} from '../../domain/taxonomy/category.repository';
import type { PaginatedResult } from '../../infrastructure/common/interfaces/paginated-result.interface';

@Injectable()
export class CategoriesService {
    constructor(
        @Inject(ICategoryRepository)
        private readonly categoryRepo: ICategoryRepository,
    ) {}

    async findAll(options: CategoryFilterOptions): Promise<PaginatedResult<Category>> {
        const page = options.page ?? 1;
        const limit = options.limit ?? 20;
        const { data, total } = await this.categoryRepo.findAll({ ...options, page, limit });
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async findById(id: string): Promise<Category> {
        const category = await this.categoryRepo.findById(id);
        if (!category) throw new NotFoundException(`Categoría '${id}' no encontrada`);
        return category;
    }

    async create(data: CreateCategoryInput): Promise<Category> {
        const existing = await this.categoryRepo.findByName(data.name);
        if (existing) throw new ConflictException(`Ya existe una categoría con el nombre '${data.name}'`);
        return this.categoryRepo.create(data);
    }

    async update(id: string, data: UpdateCategoryInput): Promise<Category> {
        await this.findById(id);
        if (data.name) {
            const existing = await this.categoryRepo.findByName(data.name);
            if (existing && existing.id !== id) {
                throw new ConflictException(`Ya existe una categoría con el nombre '${data.name}'`);
            }
        }
        return this.categoryRepo.update(id, data);
    }

    async deactivate(id: string): Promise<Category> {
        await this.findById(id);
        return this.categoryRepo.deactivate(id);
    }
}
