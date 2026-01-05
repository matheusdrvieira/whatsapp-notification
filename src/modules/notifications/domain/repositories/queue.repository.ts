import type { SendNotificationInput } from '../types/queue.types';

export abstract class QueueRepository {
  abstract enqueueSendNotification(data: SendNotificationInput): Promise<void>;
}
