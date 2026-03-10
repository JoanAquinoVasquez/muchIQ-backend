import { BusinessLocation } from './business-location.entity';

export interface BusinessLocationFilterOptions {
    search?: string;
    isActive?: boolean;
    companyId?: string;
    page?: number;
    limit?: number;
}

export interface CreateBusinessLocationInput {
    name: string;
    companyId: string;
    description?: string;
    phone?: string;
    email?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    district?: string;
    city?: string;
    country?: string;
}

export interface UpdateBusinessLocationInput {
    name?: string;
    description?: string;
    phone?: string;
    email?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    district?: string;
    city?: string;
    country?: string;
    isActive?: boolean;
}

export interface IBusinessLocationRepository {
    findAll(options: BusinessLocationFilterOptions): Promise<{ data: BusinessLocation[]; total: number }>;
    findById(id: string): Promise<BusinessLocation | null>;
    create(data: CreateBusinessLocationInput): Promise<BusinessLocation>;
    update(id: string, data: UpdateBusinessLocationInput): Promise<BusinessLocation>;
    deactivate(id: string): Promise<BusinessLocation>;
}

export const IBusinessLocationRepository = Symbol('IBusinessLocationRepository');
