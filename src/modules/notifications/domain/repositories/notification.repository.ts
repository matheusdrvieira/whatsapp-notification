import { AsyncMaybe } from '../../../../shared/core/logic/maybe';
import { Notification } from '../entities/notification.entity';

export abstract class NotificationRepository {
  abstract findById(id: string): AsyncMaybe<Notification>;
  abstract create(notification: Notification): Promise<Notification>;
  abstract findByMessageId(messageId: string): AsyncMaybe<Notification>;

  abstract markSending(notificationId: string): AsyncMaybe<void>;
  abstract markSent(notificationId: string): AsyncMaybe<void>;
  abstract markFailed(notificationId: string): AsyncMaybe<void>;

  abstract findFailed(): Promise<Notification[]>;
}
