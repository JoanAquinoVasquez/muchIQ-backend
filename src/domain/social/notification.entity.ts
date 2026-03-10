export class Notification {
    id: string;
    title: string;
    message: string;
    notificationTypeId: string;
    read: boolean;
    readAt?: Date | null;
    userId: string;
    createdAt: Date;

    constructor(partial: Partial<Notification>) {
        Object.assign(this, partial);
    }
}
