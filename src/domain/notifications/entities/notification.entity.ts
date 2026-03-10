export class NotificationTypeEntity {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;

  constructor(partial: Partial<NotificationTypeEntity>) {
    Object.assign(this, partial);
  }
}

export class NotificationEntity {
  id: string;
  title: string;
  message: string;
  notificationTypeId: string;
  read: boolean;
  readAt?: Date;
  userId: string;
  createdAt: Date;

  constructor(partial: Partial<NotificationEntity>) {
    Object.assign(this, partial);
    this.createdAt = partial.createdAt || new Date();
    this.read = partial.read || false;
  }
}
