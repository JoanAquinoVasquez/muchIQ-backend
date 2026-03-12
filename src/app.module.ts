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
import { CompaniesModule } from './infrastructure/companies/companies.module';
import { BusinessLocationsModule } from './infrastructure/business-locations/business-locations.module';
import { GamificationAchievementsModule } from './infrastructure/gamification/achievements/achievements.module';
import { GamificationDiscoveriesModule } from './infrastructure/gamification/discoveries/discoveries.module';
import { GamificationRewardsModule } from './infrastructure/gamification/rewards/rewards.module';
import { ReviewsModule } from './infrastructure/reviews/reviews.module';
import { DifficultyLevelsModule } from './infrastructure/routes/difficulty-levels/difficulty-levels.module';
import { RoutesModule } from './infrastructure/routes/routes/routes.module';
import { MediaModule } from './infrastructure/media/media.module';
import { NotificationsModule } from './infrastructure/notifications/notifications.module';
import { DishesModule } from './infrastructure/dishes/dishes.module';

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
    CompaniesModule,
    BusinessLocationsModule,
    GamificationAchievementsModule,
    GamificationDiscoveriesModule,
    GamificationRewardsModule,
    ReviewsModule,
    DifficultyLevelsModule,
    RoutesModule,
    MediaModule,
    NotificationsModule,
    DishesModule,
  ],
})
export class AppModule {}
