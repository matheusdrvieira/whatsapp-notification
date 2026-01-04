import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { WhatsappRepository } from '../../domain/repositories/whatsapp.repository';

@Injectable()
export class ProcessNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly whatsappProvider: WhatsappRepository,
    private readonly logger: Logger,
  ) { }

  async execute(input: { notificationId: string }): Promise<void> {
    if (!input.notificationId) throw new BadRequestException();

    const notification = await this.notificationRepository.markSending(input.notificationId);

    if (!notification) return;

    try {
      await this.whatsappProvider.sendText({
        to: notification.to,
        message: notification.message,
      });

      await this.notificationRepository.markSent(notification.id);
    } catch (err) {
      this.logger.error(err.message, err.stack);
      await this.notificationRepository.markQueued(notification.id);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }
}
