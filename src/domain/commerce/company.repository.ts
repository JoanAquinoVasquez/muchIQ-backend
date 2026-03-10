import { Company } from './company.entity';

export interface CompanyFilterOptions {
    search?: string;
    isActive?: boolean;
    ownerId?: string;
    page?: number;
    limit?: number;
}

export interface CreateCompanyInput {
    name: string;
    ownerId: string;
    ruc?: string;
    description?: string;
    logo?: string;
    website?: string;
    phone?: string;
    email?: string;
}

export interface UpdateCompanyInput {
    name?: string;
    ruc?: string;
    description?: string;
    logo?: string;
    website?: string;
    phone?: string;
    email?: string;
    isActive?: boolean;
}

export interface ICompanyRepository {
    findAll(options: CompanyFilterOptions): Promise<{ data: Company[]; total: number }>;
    findById(id: string): Promise<Company | null>;
    findByRuc(ruc: string): Promise<Company | null>;
    create(data: CreateCompanyInput): Promise<Company>;
    update(id: string, data: UpdateCompanyInput): Promise<Company>;
    deactivate(id: string): Promise<Company>;
}

export const ICompanyRepository = Symbol('ICompanyRepository');
