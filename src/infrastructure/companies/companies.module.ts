import { Module } from '@nestjs/common';
import { CompaniesService } from '../../application/companies/companies.service';
import { CompaniesController } from './companies.controller';
import { PrismaCompanyRepository } from './prisma-companies.repository';
import { ICompanyRepository } from '../../domain/commerce/company.repository';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Module({
    providers: [
        CompaniesService,
        PermissionsGuard,
        {
            provide: ICompanyRepository,
            useClass: PrismaCompanyRepository,
        },
    ],
    controllers: [CompaniesController],
    exports: [CompaniesService],
})
export class CompaniesModule {}
