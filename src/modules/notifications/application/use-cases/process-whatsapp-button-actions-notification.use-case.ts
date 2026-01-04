import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppLogger } from '../../../../shared/logger/app-logger.service';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import type { SendButtonActionsInput } from '../../domain/repositories/queue.repository';
import { WhatsappRepository } from '../../domain/repositories/whatsapp.repository';

@Injectable()
export class ProcessWhatsappButtonActionsNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly whatsappProvider: WhatsappRepository,
    private readonly logger: AppLogger,
  ) { }

  async execute(input: SendButtonActionsInput): Promise<void> {
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
      this.logger.error(err);

      await this.notificationRepository.markQueued(notification.id).catch(() => undefined);

      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }

    try {
      await this.notificationRepository.markSent(notification.id);
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }
}
