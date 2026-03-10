import {
    Injectable,
    Inject,
    NotFoundException,
} from '@nestjs/common';
import { BusinessLocation } from '../../domain/commerce/business-location.entity';
import {
    IBusinessLocationRepository,
    BusinessLocationFilterOptions,
    CreateBusinessLocationInput,
    UpdateBusinessLocationInput,
} from '../../domain/commerce/business-location.repository';
import { CompaniesService } from '../companies/companies.service';
import type { PaginatedResult } from '../../infrastructure/common/interfaces/paginated-result.interface';

@Injectable()
export class BusinessLocationsService {
    constructor(
        @Inject(IBusinessLocationRepository)
        private readonly locationRepo: IBusinessLocationRepository,
        private readonly companiesService: CompaniesService,
    ) {}

    async findAll(
        companyId: string,
        options: BusinessLocationFilterOptions,
        requesterId: string,
        requesterRole: string,
    ): Promise<PaginatedResult<BusinessLocation>> {
        // Verificar que la empresa existe y el usuario tiene acceso
        await this.companiesService.findById(companyId, requesterId, requesterRole);

        const page = options.page ?? 1;
        const limit = options.limit ?? 20;
        const { data, total } = await this.locationRepo.findAll({ ...options, companyId, page, limit });
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async findById(
        id: string,
        companyId: string,
        requesterId: string,
        requesterRole: string,
    ): Promise<BusinessLocation> {
        await this.companiesService.findById(companyId, requesterId, requesterRole);

        const location = await this.locationRepo.findById(id);
        if (!location) throw new NotFoundException(`Local '${id}' no encontrado`);

        // Verificar que el local pertenece a esa empresa
        if (location.companyId !== companyId) {
            throw new NotFoundException(`El local no pertenece a la empresa indicada`);
        }

        return location;
    }

    async create(
        companyId: string,
        data: Omit<CreateBusinessLocationInput, 'companyId'>,
        requesterId: string,
        requesterRole: string,
    ): Promise<BusinessLocation> {
        await this.companiesService.findById(companyId, requesterId, requesterRole);
        return this.locationRepo.create({ ...data, companyId });
    }

    async update(
        id: string,
        companyId: string,
        data: UpdateBusinessLocationInput,
        requesterId: string,
        requesterRole: string,
    ): Promise<BusinessLocation> {
        await this.findById(id, companyId, requesterId, requesterRole);
        return this.locationRepo.update(id, data);
    }

    async deactivate(
        id: string,
        companyId: string,
        requesterId: string,
        requesterRole: string,
    ): Promise<BusinessLocation> {
        await this.findById(id, companyId, requesterId, requesterRole);
        return this.locationRepo.deactivate(id);
    }
}
