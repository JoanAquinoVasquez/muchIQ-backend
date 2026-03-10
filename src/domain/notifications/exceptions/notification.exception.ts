export class NotificationTypeNotFoundException extends Error {
  constructor(id: string) {
    super(`Notification Type with id ${id} not found`);
    this.name = 'NotificationTypeNotFoundException';
  }
}

export class NotificationNotFoundException extends Error {
  constructor(id: string) {
    super(`Notification with id ${id} not found`);
    this.name = 'NotificationNotFoundException';
  }
}
