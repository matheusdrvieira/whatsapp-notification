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
import type { PixKeyType } from '../../domain/repositories/whatsapp.repository';

@Injectable()
export class CreateWhatsappButtonPixNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly queue: QueueRepository,
    private readonly logger: AppLogger,
  ) {}

  async execute(input: {
    to: string;
    pixKey: string;
    pixType: PixKeyType;
    merchantName?: string;
  }): Promise<Notification> {
    try {
      const created = await this.notificationRepository.create(
        Notification.create({
          type: NotificationType.BUTTON_PIX,
          to: input.to,
          message: '',
          status: NotificationStatus.QUEUED,
        }),
      );

      await this.queue.enqueueSendNotification({
        notificationId: created.id,
        type: NotificationType.BUTTON_PIX,
        pixKey: input.pixKey,
        pixType: input.pixType,
        merchantName: input.merchantName,
      });

      return created;
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException();
    }
  }
}
