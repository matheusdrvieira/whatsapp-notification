export abstract class QueueRepository {
  abstract enqueueSendNotification(notificationId: string): Promise<void>;
}
