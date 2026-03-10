import { Module } from '@nestjs/common';
import { CategoriesService } from '../../application/categories/categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaCategoryRepository } from './prisma-categories.repository';
import { ICategoryRepository } from '../../domain/taxonomy/category.repository';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Module({
    providers: [
        CategoriesService,
        PermissionsGuard,
        {
            provide: ICategoryRepository,
            useClass: PrismaCategoryRepository,
        },
    ],
    controllers: [CategoriesController],
    exports: [CategoriesService],
})
export class CategoriesModule {}
