import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppLogger } from '../../../../shared/logger/app-logger.service';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationStatus } from '../../domain/enums/notification-status.enum';
import { NotificationType } from '../../domain/enums/notification-type.enum';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { QueueRepository } from '../../domain/repositories/queue.repository';
import { CreateNotificationStrategy } from '../strategies/create-notification.strategy';

@Injectable()
export class CreateNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly queue: QueueRepository,
    private readonly createNotificationStrategy: CreateNotificationStrategy,
    private readonly logger: AppLogger,
  ) { }

  async execute(input: any): Promise<Notification> {
    try {
      const message = input.type === NotificationType.BUTTON_PIX ? '' : input.message;

      const notification = await this.notificationRepository.create(
        Notification.create({
          type: input.type,
          to: input.to,
          message,
          status: NotificationStatus.QUEUED,
        }),
      );

      const handler = this.createNotificationStrategy.get(input.type)

      await this.queue.enqueueSendNotification(handler(notification.id, input));
      return notification;
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }
}
