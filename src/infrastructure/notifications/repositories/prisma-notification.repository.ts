import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { INotificationRepository, INotificationTypeRepository } from '../../../domain/notifications/interfaces/notification.repository.interface';
import { NotificationEntity, NotificationTypeEntity } from '../../../domain/notifications/entities/notification.entity';

@Injectable()
export class PrismaNotificationTypeRepository implements INotificationTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<NotificationTypeEntity[]> {
    const records = await this.prisma.notificationType.findMany();
    return records.map(this.mapToDomain);
  }

  async findById(id: string): Promise<NotificationTypeEntity | null> {
    const record = await this.prisma.notificationType.findUnique({
      where: { id },
    });
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async create(data: Partial<NotificationTypeEntity>): Promise<NotificationTypeEntity> {
    const record = await this.prisma.notificationType.create({
      data: {
        name: data.name!,
        description: data.description,
        icon: data.icon,
        color: data.color,
      },
    });
    return this.mapToDomain(record);
  }

  async update(id: string, data: Partial<NotificationTypeEntity>): Promise<NotificationTypeEntity> {
    const record = await this.prisma.notificationType.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        icon: data.icon,
        color: data.color,
      },
    });
    return this.mapToDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.notificationType.delete({
      where: { id },
    });
  }

  private mapToDomain(record: any): NotificationTypeEntity {
    return new NotificationTypeEntity({
      id: record.id,
      name: record.name,
      description: record.description ?? undefined,
      icon: record.icon ?? undefined,
      color: record.color ?? undefined,
    });
  }
}

@Injectable()
export class PrismaNotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUserId(userId: string): Promise<NotificationEntity[]> {
    const records = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(this.mapToDomain);
  }

  async findById(id: string): Promise<NotificationEntity | null> {
    const record = await this.prisma.notification.findUnique({
      where: { id },
    });
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async create(data: Partial<NotificationEntity>): Promise<NotificationEntity> {
    const record = await this.prisma.notification.create({
      data: {
        title: data.title!,
        message: data.message!,
        notificationTypeId: data.notificationTypeId!,
        userId: data.userId!,
        read: data.read ?? false,
      },
    });
    return this.mapToDomain(record);
  }

  async markAsRead(id: string): Promise<NotificationEntity> {
    const record = await this.prisma.notification.update({
      where: { id },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
    return this.mapToDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.notification.delete({
      where: { id },
    });
  }

  private mapToDomain(record: any): NotificationEntity {
    return new NotificationEntity({
      id: record.id,
      title: record.title,
      message: record.message,
      notificationTypeId: record.notificationTypeId,
      read: record.read,
      readAt: record.readAt ?? undefined,
      userId: record.userId,
      createdAt: record.createdAt,
    });
  }
}
