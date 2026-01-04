import { Entity } from '../../../../shared/core/domain/entity';
import { NotificationStatus } from '../enums/notification-status.enum';

export type NotificationProps = {
  id?: string;
  to: string;
  message: string;
  status: NotificationStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Notification extends Entity<NotificationProps> {
  get id() {
    return this.props.id!;
  }

  get to() {
    return this.props.to;
  }

  get message() {
    return this.props.message;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: NotificationProps) {
    return new Notification({
      ...props,
    });
  }
}
