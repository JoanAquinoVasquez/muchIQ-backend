import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { INotificationRepository, INotificationTypeRepository } from '../../../domain/notifications/interfaces/notification.repository.interface';
import { CreateNotificationDto, CreateNotificationTypeDto } from '../dto/create-notification.dto';
import { UpdateNotificationTypeDto } from '../dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
    @Inject(INotificationTypeRepository)
    private readonly notificationTypeRepository: INotificationTypeRepository,
  ) {}

  // Notification Types
  async createNotificationType(dto: CreateNotificationTypeDto) {
    return this.notificationTypeRepository.create(dto);
  }

  async findAllNotificationTypes() {
    return this.notificationTypeRepository.findAll();
  }

  async findOneNotificationType(id: string) {
    const type = await this.notificationTypeRepository.findById(id);
    if (!type) throw new NotFoundException(`Notification Type ${id} not found`);
    return type;
  }

  async updateNotificationType(id: string, dto: UpdateNotificationTypeDto) {
    const type = await this.notificationTypeRepository.findById(id);
    if (!type) throw new NotFoundException(`Notification Type ${id} not found`);
    return this.notificationTypeRepository.update(id, dto);
  }

  async removeNotificationType(id: string) {
    const type = await this.notificationTypeRepository.findById(id);
    if (!type) throw new NotFoundException(`Notification Type ${id} not found`);
    return this.notificationTypeRepository.delete(id);
  }

  // Notifications
  async createNotification(dto: CreateNotificationDto) {
    return this.notificationRepository.create(dto);
  }

  async findAllByUserId(userId: string) {
    return this.notificationRepository.findAllByUserId(userId);
  }

  async markAsRead(id: string) {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) throw new NotFoundException(`Notification ${id} not found`);
    return this.notificationRepository.markAsRead(id);
  }

  async removeNotification(id: string) {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) throw new NotFoundException(`Notification ${id} not found`);
    return this.notificationRepository.delete(id);
  }
}
