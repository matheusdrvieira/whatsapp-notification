import { Entity } from '../../../../shared/core/domain/entity';
import { NotificationStatus } from '../enums/notification-status.enum';
import { NotificationType } from '../enums/notification-type.enum';

export type NotificationProps = {
  id?: string;
  type: NotificationType;
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

  get type() {
    return this.props.type;
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
