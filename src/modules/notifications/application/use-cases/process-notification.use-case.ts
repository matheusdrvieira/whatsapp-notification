import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { NotificationType } from '../../domain/enums/notification-type.enum';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import type { SendNotificationJobData } from '../../domain/repositories/queue.repository';
import { SendMessageOutput, WhatsappRepository } from '../../domain/repositories/whatsapp.repository';

@Injectable()
export class ProcessNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly whatsappProvider: WhatsappRepository,
    private readonly logger: Logger,
  ) { }

  async execute(input: SendNotificationJobData): Promise<void> {
    if (!input.notificationId) throw new BadRequestException();

    const notification = await this.notificationRepository.markSending(input.notificationId);

    if (!notification) return;

    try {
      const handlerByType: Record<NotificationType, () => Promise<SendMessageOutput>> = {
        [NotificationType.TEXT]: async () => this.whatsappProvider.sendText({
          to: notification.to,
          message: notification.message,
        }),

        [NotificationType.BUTTON_ACTIONS]: async () => {
          const payload = input as Extract<SendNotificationJobData, {
            type: NotificationType.BUTTON_ACTIONS
          }>;

          return this.whatsappProvider.sendButtonActions({
            to: notification.to,
            message: notification.message,
            buttonActions: payload.buttonActions,
            delayMessage: payload.delayMessage,
            title: payload.title,
            footer: payload.footer,
          });
        },

        [NotificationType.BUTTON_OTP]: async () => {
          const payload = input as Extract<SendNotificationJobData, {
            type: NotificationType.BUTTON_OTP
          }>;

          return this.whatsappProvider.sendButtonOtp({
            to: notification.to,
            message: notification.message,
            code: payload.code,
            image: payload.image,
            buttonText: payload.buttonText,
          });
        },

        [NotificationType.BUTTON_PIX]: async () => {
          const payload = input as Extract<SendNotificationJobData, {
            type: NotificationType.BUTTON_PIX
          }>;

          return this.whatsappProvider.sendButtonPix({
            to: notification.to,
            pixKey: payload.pixKey,
            type: payload.pixType,
            merchantName: payload.merchantName,
          });
        },
      };

      await handlerByType[input.type]();

    } catch (err) {
      this.logger.error(err.message, err.stack);

      await this.notificationRepository.markQueued(notification.id).catch(() => undefined);

      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }

    try {
      await this.notificationRepository.markSent(notification.id);
    } catch (err) {
      this.logger.error(err.message, err.stack);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }
}
