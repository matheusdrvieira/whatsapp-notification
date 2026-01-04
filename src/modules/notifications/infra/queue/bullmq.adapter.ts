import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';
import { BullMqService } from '../../../../shared/bullmq/bullmq.service';
import { QueueRepository } from '../../domain/repositories/queue.repository';

type SendQueueData = {
  notificationId: string;
};

@Injectable()
export class BullMqAdapter implements QueueRepository {
  private readonly queue: Queue<SendQueueData>;

  constructor(private readonly bullmq: BullMqService) {
    this.queue = this.bullmq.getQueue<SendQueueData>('notifications-send', {
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 60_000,
        },
        removeOnComplete: true,
        removeOnFail: true,
      },
    });
  }

  async enqueueSendNotification(notificationId: string): Promise<void> {
    await this.queue.add('send-notification', { notificationId });
  }
}
