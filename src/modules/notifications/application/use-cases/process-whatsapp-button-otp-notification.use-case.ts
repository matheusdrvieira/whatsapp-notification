import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppLogger } from '../../../../shared/logger/app-logger.service';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import type { SendButtonOtpJobData } from '../../domain/repositories/queue.repository';
import { WhatsappRepository } from '../../domain/repositories/whatsapp.repository';

@Injectable()
export class ProcessWhatsappButtonOtpNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly whatsappProvider: WhatsappRepository,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(ProcessWhatsappButtonOtpNotificationUseCase.name);
  }

  async execute(input: SendButtonOtpJobData): Promise<void> {
    if (!input.notificationId) throw new BadRequestException();

    const notification = await this.notificationRepository.markSending(input.notificationId);

    if (!notification) return;

    try {
      await this.whatsappProvider.sendButtonOtp({
        to: notification.to,
        message: notification.message,
        code: input.code,
        image: input.image,
        buttonText: input.buttonText,
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
