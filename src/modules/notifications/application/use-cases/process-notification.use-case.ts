import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Logger } from '../../../../shared/logger/logger.service';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationStatus } from '../../domain/enums/notification-status.enum';
import type { SendNotificationInput } from '../../domain/types/queue.types';
import { ProcessNotificationStrategy } from '../strategies/process-notification.strategy';
import { CreateNotificationUseCase } from './create-notification.use-case';

@Injectable()
export class ProcessNotificationUseCase {
  constructor(
    private readonly processNotificationStrategy: ProcessNotificationStrategy,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly logger: Logger,
  ) { }

  async execute(input: SendNotificationInput): Promise<Notification> {
    try {
      const handler = this.processNotificationStrategy.get(input.type);
      const sendResult = await handler(input);

      return await this.createNotificationUseCase.execute(Notification.create({
        phone: input.phone,
        type: input.type,
        messageId: sendResult.messageId,
        status: NotificationStatus.SENT,
      }));

    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }
}
