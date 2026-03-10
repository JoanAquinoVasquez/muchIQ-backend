import { Category } from './category.entity';

export interface CategoryFilterOptions {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
}

export interface CreateCategoryInput {
    name: string;
    description?: string;
    icon?: string;
    isActive?: boolean;
}

export interface UpdateCategoryInput {
    name?: string;
    description?: string;
    icon?: string;
    isActive?: boolean;
}

export interface ICategoryRepository {
    findAll(options: CategoryFilterOptions): Promise<{ data: Category[]; total: number }>;
    findById(id: string): Promise<Category | null>;
    findByName(name: string): Promise<Category | null>;
    create(data: CreateCategoryInput): Promise<Category>;
    update(id: string, data: UpdateCategoryInput): Promise<Category>;
    deactivate(id: string): Promise<Category>;
}

export const ICategoryRepository = Symbol('ICategoryRepository');
