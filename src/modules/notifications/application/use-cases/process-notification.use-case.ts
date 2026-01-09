import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppLogger } from '../../../../shared/logger/app-logger.service';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import type { SendNotificationInput } from '../../domain/types/queue.types';
import { ProcessNotificationStrategy } from '../strategies/process-notification.strategy';

@Injectable()
export class ProcessNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly processNotificationStrategy: ProcessNotificationStrategy,
    private readonly logger: AppLogger,
  ) {}

  async execute(input: SendNotificationInput): Promise<void> {
    if (!input.notificationId) throw new BadRequestException();

    const notification = await this.notificationRepository.markSending(
      input.notificationId,
    );

    if (!notification) return;

    try {
      const handler = this.processNotificationStrategy.get(input.type);
      await handler(input, notification);
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
  }
}
