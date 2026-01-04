import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import type { SendButtonPixJobData } from '../../domain/repositories/queue.repository';
import { WhatsappRepository } from '../../domain/repositories/whatsapp.repository';

@Injectable()
export class ProcessWhatsappButtonPixNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly whatsappProvider: WhatsappRepository,
    private readonly logger: Logger,
  ) {}

  async execute(input: SendButtonPixJobData): Promise<void> {
    if (!input.notificationId) throw new BadRequestException();

    const notification = await this.notificationRepository.markSending(input.notificationId);

    if (!notification) return;

    try {
      await this.whatsappProvider.sendButtonPix({
        to: notification.to,
        pixKey: input.pixKey,
        type: input.pixType,
        merchantName: input.merchantName,
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
