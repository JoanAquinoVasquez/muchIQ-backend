import {
    Injectable,
    Inject,
    NotFoundException,
    ConflictException,
    ForbiddenException,
} from '@nestjs/common';
import { Company } from '../../domain/commerce/company.entity';
import {
    ICompanyRepository,
    CompanyFilterOptions,
    CreateCompanyInput,
    UpdateCompanyInput,
} from '../../domain/commerce/company.repository';
import type { PaginatedResult } from '../../infrastructure/common/interfaces/paginated-result.interface';

@Injectable()
export class CompaniesService {
    constructor(
        @Inject(ICompanyRepository)
        private readonly companyRepo: ICompanyRepository,
    ) {}

    async findAll(
        options: CompanyFilterOptions,
        requesterId: string,
        requesterRole: string,
    ): Promise<PaginatedResult<Company>> {
        const page = options.page ?? 1;
        const limit = options.limit ?? 20;

        // PARTNER solo ve sus propias empresas
        const filter: CompanyFilterOptions =
            requesterRole === 'PARTNER'
                ? { ...options, ownerId: requesterId, page, limit }
                : { ...options, page, limit };

        const { data, total } = await this.companyRepo.findAll(filter);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async findById(id: string, requesterId: string, requesterRole: string): Promise<Company> {
        const company = await this.companyRepo.findById(id);
        if (!company) throw new NotFoundException(`Empresa '${id}' no encontrada`);
        this.assertOwnership(company, requesterId, requesterRole);
        return company;
    }

    async create(data: CreateCompanyInput): Promise<Company> {
        if (data.ruc) {
            const existing = await this.companyRepo.findByRuc(data.ruc);
            if (existing) throw new ConflictException(`Ya existe una empresa con el RUC '${data.ruc}'`);
        }
        return this.companyRepo.create(data);
    }

    async update(
        id: string,
        data: UpdateCompanyInput,
        requesterId: string,
        requesterRole: string,
    ): Promise<Company> {
        const company = await this.findById(id, requesterId, requesterRole);

        if (data.ruc && data.ruc !== company.ruc) {
            const existing = await this.companyRepo.findByRuc(data.ruc);
            if (existing) throw new ConflictException(`Ya existe una empresa con el RUC '${data.ruc}'`);
        }

        return this.companyRepo.update(id, data);
    }

    async deactivate(
        id: string,
        requesterId: string,
        requesterRole: string,
    ): Promise<Company> {
        await this.findById(id, requesterId, requesterRole);
        return this.companyRepo.deactivate(id);
    }

    // PARTNER solo puede operar sobre sus propias empresas; ADMIN puede todo
    private assertOwnership(company: Company, requesterId: string, requesterRole: string): void {
        if (requesterRole === 'ADMIN') return;
        if (company.ownerId !== requesterId) {
            throw new ForbiddenException('No tienes acceso a esta empresa');
        }
    }
}
