import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { UsersModule } from './infrastructure/users/users.module';
import { PlacesModule } from './infrastructure/places/places.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    PlacesModule,
  ],
})
export class AppModule {}
