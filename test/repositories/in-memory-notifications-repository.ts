import type { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import type { Notification } from '@/domain/notification/enterprise/entities/notification';

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  items: Notification[] = [];

  async findById(id: string): Promise<Notification | null> {
    const notification = this.items.find((item) => item.id.toString() === id);

    if (!notification) {
      return null;
    }

    return notification;
  }

  async save(notification: Notification): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === notification.id,
    );
    this.items[itemIndex] = notification;
    return Promise.resolve();
  }

  async create(notification: Notification): Promise<void> {
    this.items.push(notification);
  }
}
