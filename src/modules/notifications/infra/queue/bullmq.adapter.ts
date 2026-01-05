import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';
import { BullMqService } from '../../../../shared/bullmq/bullmq.service';
import { AppLogger } from '../../../../shared/logger/app-logger.service';
import type { SendNotificationInput } from '../../domain/types/queue.types';
import { QueueRepository } from '../../domain/repositories/queue.repository';

@Injectable()
export class BullMqAdapter implements QueueRepository {
  private readonly queue: Queue<SendNotificationInput>;

  constructor(
    private readonly bullmq: BullMqService,
    private readonly logger: AppLogger,
  ) {
    this.queue = this.bullmq.getQueue<SendNotificationInput>('notifications-send', {
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

  async enqueueSendNotification(data: SendNotificationInput): Promise<void> {
    try {
      await this.queue.add('send-notification', data);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
