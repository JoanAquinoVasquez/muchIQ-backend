import { NotificationEntity, NotificationTypeEntity } from '../entities/notification.entity';

export interface INotificationRepository {
  findAllByUserId(userId: string): Promise<NotificationEntity[]>;
  findById(id: string): Promise<NotificationEntity | null>;
  create(data: Partial<NotificationEntity>): Promise<NotificationEntity>;
  markAsRead(id: string): Promise<NotificationEntity>;
  delete(id: string): Promise<void>;
}

export interface INotificationTypeRepository {
  findAll(): Promise<NotificationTypeEntity[]>;
  findById(id: string): Promise<NotificationTypeEntity | null>;
  create(data: Partial<NotificationTypeEntity>): Promise<NotificationTypeEntity>;
  update(id: string, data: Partial<NotificationTypeEntity>): Promise<NotificationTypeEntity>;
  delete(id: string): Promise<void>;
}

export const INotificationRepository = Symbol('INotificationRepository');
export const INotificationTypeRepository = Symbol('INotificationTypeRepository');
