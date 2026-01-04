import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppLogger } from '../../../../shared/logger/app-logger.service';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import type { SendButtonPixInput } from '../../domain/repositories/queue.repository';
import { WhatsappRepository } from '../../domain/repositories/whatsapp.repository';

@Injectable()
export class ProcessWhatsappButtonPixNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly whatsappProvider: WhatsappRepository,
    private readonly logger: AppLogger,
  ) { }

  async execute(input: SendButtonPixInput): Promise<void> {
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
