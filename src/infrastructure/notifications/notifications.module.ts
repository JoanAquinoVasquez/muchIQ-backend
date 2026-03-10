import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationTypesController, NotificationsController } from '../../application/notifications/controllers/notifications.controller';
import { NotificationsService } from '../../application/notifications/services/notifications.service';
import { PrismaNotificationTypeRepository, PrismaNotificationRepository } from './repositories/prisma-notification.repository';
import { INotificationRepository, INotificationTypeRepository } from '../../domain/notifications/interfaces/notification.repository.interface';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationTypesController, NotificationsController],
  providers: [
    NotificationsService,
    {
      provide: INotificationTypeRepository,
      useClass: PrismaNotificationTypeRepository,
    },
    {
      provide: INotificationRepository,
      useClass: PrismaNotificationRepository,
    },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
