import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Logger } from '../../../../shared/logger/logger.service';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import type { SendNotificationInput } from '../../domain/types/queue.types';
import type { WhatsappSendMessageOutput } from '../../domain/types/whatsapp.types';
import { ProcessNotificationStrategy } from '../strategies/process-notification.strategy';

@Injectable()
export class ProcessNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly processNotificationStrategy: ProcessNotificationStrategy,
    private readonly logger: Logger,
  ) { }

  async execute(input: SendNotificationInput): Promise<WhatsappSendMessageOutput | null> {
    if (!input.notificationId) throw new BadRequestException();

    const notification = await this.notificationRepository.markSending(
      input.notificationId,
    );

    if (!notification) return null;

    let sendResult: WhatsappSendMessageOutput | null = null;

    try {
      const handler = this.processNotificationStrategy.get(input.type);
      sendResult = await handler(input, notification);

    } catch (err) {
      this.logger.error(err);

      await this.notificationRepository
        .markFailed(notification.id)
        .catch(() => undefined);

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

    return sendResult;
  }
}
