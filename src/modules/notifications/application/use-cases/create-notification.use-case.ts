import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppLogger } from '../../../../shared/logger/app-logger.service';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationStatus } from '../../domain/enums/notification-status.enum';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { CreateNotificationStrategy } from '../strategies/create-notification.strategy';
import { ProcessNotificationUseCase } from './process-notification.use-case';

@Injectable()
export class CreateNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly processNotification: ProcessNotificationUseCase,
    private readonly createNotificationStrategy: CreateNotificationStrategy,
    private readonly logger: AppLogger,
  ) { }

  async execute(input: any): Promise<Notification> {
    try {
      const notification = await this.notificationRepository.create(
        Notification.create({
          type: input.type,
          to: input.to,
          message: input.message,
          status: NotificationStatus.QUEUED,
        }),
      );

      const handler = this.createNotificationStrategy.get(input.type);
      const payload = handler(notification.id, input);

      await this.processNotification.execute(payload);

      return notification;
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }
}
