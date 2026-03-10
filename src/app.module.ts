import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { UsersModule } from './infrastructure/users/users.module';
import { PlacesModule } from './infrastructure/places/places.module';
import { RolesModule } from './infrastructure/roles/roles.module';
import { SystemModulesModule } from './infrastructure/system-modules/system-modules.module';
import { CategoriesModule } from './infrastructure/categories/categories.module';
import { PermissionsModule } from './infrastructure/permissions/permissions.module';
import { RoleModulesModule } from './infrastructure/role-modules/role-modules.module';

@Module({
    imports: [
        PrismaModule,
        AuthModule,
        UsersModule,
        PlacesModule,
        RolesModule,
        SystemModulesModule,
        CategoriesModule,
        PermissionsModule,
        RoleModulesModule,
    ],
})
export class AppModule {}
