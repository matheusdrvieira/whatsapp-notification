import { Entity } from '../../../../shared/core/domain/entity';
import { NotificationStatus } from '../enums/notification-status.enum';
import { NotificationType } from '../enums/notification-type.enum';

export type NotificationProps = {
  id?: string;
  messageId: string;
  type: NotificationType;
  phone: string;
  status: NotificationStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Notification extends Entity<NotificationProps> {
  get id() {
    return this.props.id!;
  }

  get messageId() {
    return this.props.messageId;
  }

  get type() {
    return this.props.type;
  }

  get phone() {
    return this.props.phone;
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
