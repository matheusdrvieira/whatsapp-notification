import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import type { SendButtonActionsJobData } from '../../domain/repositories/queue.repository';
import { WhatsappRepository } from '../../domain/repositories/whatsapp.repository';

@Injectable()
export class ProcessWhatsappButtonActionsNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly whatsappProvider: WhatsappRepository,
    private readonly logger: Logger,
  ) {}

  async execute(input: SendButtonActionsJobData): Promise<void> {
    if (!input.notificationId) throw new BadRequestException();

    const notification = await this.notificationRepository.markSending(input.notificationId);

    if (!notification) return;

    try {
      await this.whatsappProvider.sendButtonActions({
        to: notification.to,
        message: notification.message,
        buttonActions: input.buttonActions,
        delayMessage: input.delayMessage,
        title: input.title,
        footer: input.footer,
      });
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
