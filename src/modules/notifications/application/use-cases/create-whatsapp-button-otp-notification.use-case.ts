import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationStatus } from '../../domain/enums/notification-status.enum';
import { NotificationType } from '../../domain/enums/notification-type.enum';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { QueueRepository } from '../../domain/repositories/queue.repository';

@Injectable()
export class CreateWhatsappButtonOtpNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly queue: QueueRepository,
    private readonly logger: Logger,
  ) {}

  async execute(input: {
    to: string;
    message: string;
    code: string;
    image?: string;
    buttonText?: string;
  }): Promise<Notification> {
    try {
      const created = await this.notificationRepository.create(
        Notification.create({
          type: NotificationType.BUTTON_OTP,
          to: input.to,
          message: input.message,
          status: NotificationStatus.QUEUED,
        }),
      );

      await this.queue.enqueueSendNotification({
        notificationId: created.id,
        type: NotificationType.BUTTON_OTP,
        code: input.code,
        image: input.image,
        buttonText: input.buttonText,
      });

      return created;
    } catch (err) {
      this.logger.error(err.message, err.stack);
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException();
    }
  }
}

