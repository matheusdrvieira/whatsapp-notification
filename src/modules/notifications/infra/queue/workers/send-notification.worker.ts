import { HttpException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UnrecoverableError, Worker } from 'bullmq';
import { BullMqService } from '../../../../../shared/bullmq/bullmq.service';
import { ProcessNotificationUseCase } from '../../../application/use-cases/process-notification.use-case';
import { NotificationRepository } from '../../../domain/repositories/notification.repository';

type SendQueueData = {
  notificationId: string;
};

@Injectable()
export class SendNotificationWorker implements OnModuleInit {
  private worker?: Worker<SendQueueData>;

  constructor(
    private readonly bullmq: BullMqService,
    private readonly processNotification: ProcessNotificationUseCase,
    private readonly notificationRepository: NotificationRepository,
    private readonly logger: Logger,
  ) { }

  onModuleInit(): void {
    this.worker = this.bullmq.createWorker<SendQueueData>(
      'notifications-send',
      async (job) => {
        const { notificationId } = job.data;

        try {
          await this.processNotification.execute({ notificationId });
        } catch (err) {
          this.logError(err);

          if (this.isUnrecoverableHttpError(err)) {
            await this.notificationRepository
              .markFailed(notificationId)
              .catch((markErr) => this.logError(markErr));

            throw new UnrecoverableError(this.getErrorMessage(err));
          }

          throw this.asError(err);
        }
      },
      { concurrency: 10 },
    );

    this.worker.on('failed', (job) => {
      const notificationId = job?.data?.notificationId;
      if (!notificationId) return;

      const attemptsMade = Number(job.attemptsMade ?? 0);
      const attempts = Number(job.opts?.attempts ?? 1);

      if (attemptsMade < attempts) return;

      void this.notificationRepository
        .markFailed(notificationId)
        .catch((err) => this.logError(err));
    });
  }

  private isUnrecoverableHttpError(err: unknown): err is HttpException {
    if (!(err instanceof HttpException)) return false;

    const status = err.getStatus();

    // 4xx (exceto 429) => erro de requisição/validação, não adianta retry
    return status >= 400 && status < 500 && status !== 429;
  }

  private logError(err: unknown): void {
    const e = err as any;
    this.logger.error(e?.message ?? String(err), e?.stack);
  }

  private getErrorMessage(err: unknown): string {
    const e = err as any;
    return e?.message ?? String(err);
  }

  private asError(err: unknown): Error {
    if (err instanceof Error) return err;
    return new Error(String(err));
  }
}
