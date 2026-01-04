import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { UnrecoverableError, Worker } from 'bullmq';
import { ProcessWhatsappButtonActionsNotificationUseCase } from 'src/modules/notifications/application/use-cases/process-whatsapp-button-actions-notification.use-case';
import { ProcessWhatsappButtonOtpNotificationUseCase } from 'src/modules/notifications/application/use-cases/process-whatsapp-button-otp-notification.use-case';
import { ProcessWhatsappButtonPixNotificationUseCase } from 'src/modules/notifications/application/use-cases/process-whatsapp-button-pix-notification.use-case';
import { ProcessWhatsappSendTextNotificationUseCase } from 'src/modules/notifications/application/use-cases/process-whatsapp-send-text-notification.use-case';
import { NotificationType } from 'src/modules/notifications/domain/enums/notification-type.enum';
import { BullMqService } from '../../../../../shared/bullmq/bullmq.service';
import { AppLogger } from '../../../../../shared/logger/app-logger.service';
import { NotificationRepository } from '../../../domain/repositories/notification.repository';
import type { SendButtonActionsJobData, SendButtonOtpJobData, SendButtonPixJobData, SendNotificationJobData, SendTextJobData } from '../../../domain/repositories/queue.repository';

@Injectable()
export class SendNotificationWorker implements OnModuleInit {
  private worker?: Worker<SendNotificationJobData>;

  constructor(
    private readonly bullmq: BullMqService,
    private readonly processWhatsappButtonActions: ProcessWhatsappButtonActionsNotificationUseCase,
    private readonly processWhatsappButtonOtp: ProcessWhatsappButtonOtpNotificationUseCase,
    private readonly processWhatsappButtonPix: ProcessWhatsappButtonPixNotificationUseCase,
    private readonly processWhatsappSendText: ProcessWhatsappSendTextNotificationUseCase,
    private readonly notificationRepository: NotificationRepository,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(SendNotificationWorker.name);
  }

  onModuleInit(): void {
    this.worker = this.bullmq.createWorker<SendNotificationJobData>(
      'notifications-send',
      async (job) => {
        const { notificationId, type } = job.data;

        try {
          const handlerByType: Record<NotificationType, (input: SendNotificationJobData) => Promise<void>> = {
            [NotificationType.TEXT]: async (input: SendTextJobData) =>
              this.processWhatsappSendText.execute(input),
            [NotificationType.BUTTON_ACTIONS]: async (input: SendButtonActionsJobData) =>
              this.processWhatsappButtonActions.execute(input),
            [NotificationType.BUTTON_OTP]: async (input: SendButtonOtpJobData) =>
              this.processWhatsappButtonOtp.execute(input),
            [NotificationType.BUTTON_PIX]: async (input: SendButtonPixJobData) =>
              this.processWhatsappButtonPix.execute(input),
          };

          await handlerByType[type](job.data);
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
    this.logger.error(err);
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
