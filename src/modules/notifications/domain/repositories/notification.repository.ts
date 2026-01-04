import { AsyncMaybe } from '../../../../shared/core/logic/maybe';
import { Notification } from '../entities/notification.entity';

export abstract class NotificationRepository {
  abstract findById(id: string): AsyncMaybe<Notification>;
  abstract create(notification: Notification): Promise<Notification>;

  abstract markSending(notificationId: string): AsyncMaybe<Notification>;
  abstract markQueued(notificationId: string): AsyncMaybe<Notification>;
  abstract markSent(notificationId: string): AsyncMaybe<Notification>;
  abstract markFailed(notificationId: string): AsyncMaybe<Notification>;
}
