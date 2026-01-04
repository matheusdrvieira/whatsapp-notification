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
import type { WhatsappButtonAction } from '../../domain/repositories/whatsapp.repository';

type ButtonActionInput = {
  id?: string;
  type: 'CALL' | 'URL' | 'REPLY';
  phone?: string;
  url?: string;
  label: string;
};

@Injectable()
export class CreateWhatsappButtonActionsNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly queue: QueueRepository,
    private readonly logger: AppLogger,
  ) {}

  async execute(input: {
    to: string;
    message: string;
    buttonActions: ButtonActionInput[];
    delayMessage?: number;
    title?: string;
    footer?: string;
  }): Promise<Notification> {
    try {
      const created = await this.notificationRepository.create(
        Notification.create({
          type: NotificationType.BUTTON_ACTIONS,
          to: input.to,
          message: input.message,
          status: NotificationStatus.QUEUED,
        }),
      );

      const buttonActions: WhatsappButtonAction[] = input.buttonActions.map((action) => {
        switch (action.type) {
          case 'CALL':
            return {
              id: action.id,
              type: 'CALL',
              phone: action.phone!,
              label: action.label,
            };
          case 'URL':
            return {
              id: action.id,
              type: 'URL',
              url: action.url!,
              label: action.label,
            };
          case 'REPLY':
          default:
            return {
              id: action.id,
              type: 'REPLY',
              label: action.label,
            };
        }
      });

      await this.queue.enqueueSendNotification({
        notificationId: created.id,
        type: NotificationType.BUTTON_ACTIONS,
        buttonActions,
        delayMessage: input.delayMessage,
        title: input.title,
        footer: input.footer,
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
