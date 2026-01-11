import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Logger } from '../../../../shared/logger/logger.service';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationRepository } from '../../domain/repositories/notification.repository';

@Injectable()
export class CreateNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly logger: Logger,
  ) { }

  async execute(input: Notification): Promise<Notification> {
    try {
      return await this.notificationRepository.create(
        Notification.create({
          type: input.type,
          phone: input.phone,
          status: input.status,
          messageId: input.messageId,
        })
      );
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }
}
