import { Entity } from '@/core/entities/entity';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { Optional } from '@/core/types/optional';

export interface NotificationProps {
  title: string;
  content: string;
  recipientId: UniqueEntityId;
  createdAt: Date;
  readAt?: Date | null;
}

type CreateNotificationProps = Optional<NotificationProps, 'createdAt'>;

export class Notification extends Entity<NotificationProps> {
  static create(props: CreateNotificationProps, id?: UniqueEntityId) {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return notification;
  }

  get recipientId() {
    return this.props.recipientId;
  }

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get readAt() {
    return this.props.readAt;
  }

  read() {
    this.props.readAt = new Date();
  }
}
