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
import {
  QueueRepository,
  SendNotificationJobData,
} from '../../domain/repositories/queue.repository';
import type {
  PixKeyType,
  WhatsappButtonAction,
} from '../../domain/repositories/whatsapp.repository';

export type CreateNotificationInput = {
  type: NotificationType;
  to: string;
  message?: string;

  buttonActions?: Array<{
    id?: string;
    type: 'CALL' | 'URL' | 'REPLY';
    phone?: string;
    url?: string;
    label: string;
  }>;
  delayMessage?: number;
  title?: string;
  footer?: string;

  code?: string;
  image?: string;
  buttonText?: string;

  pixKey?: string;
  pixType?: PixKeyType;
  merchantName?: string;
};

@Injectable()
export class CreateNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly queue: QueueRepository,
    private readonly logger: Logger,
  ) { }

  async execute(input: CreateNotificationInput): Promise<Notification> {
    try {
      const created = await this.notificationRepository.create(
        Notification.create({
          type: input.type,
          to: input.to,
          message: input.message ?? '',
          status: NotificationStatus.QUEUED,
        }),
      );

      type ButtonActionInput = NonNullable<CreateNotificationInput['buttonActions']>[number];

      const buttonActionByType: Record<ButtonActionInput['type'], (action: ButtonActionInput) => WhatsappButtonAction> = {
        CALL: (action: ButtonActionInput): WhatsappButtonAction => ({
          id: action.id,
          type: 'CALL',
          phone: action.phone!,
          label: action.label,
        }),
        URL: (action: ButtonActionInput): WhatsappButtonAction => ({
          id: action.id,
          type: 'URL',
          url: action.url!,
          label: action.label,
        }),
        REPLY: (action: ButtonActionInput): WhatsappButtonAction => ({
          id: action.id,
          type: 'REPLY',
          label: action.label,
        }),
      };

      const jobDataByType: Record<NotificationType, () => SendNotificationJobData> = {
        [NotificationType.TEXT]: (): SendNotificationJobData => ({
          notificationId: created.id,
          type: NotificationType.TEXT,
        }),
        [NotificationType.BUTTON_ACTIONS]: (): SendNotificationJobData => ({
          notificationId: created.id,
          type: NotificationType.BUTTON_ACTIONS,
          buttonActions: input.buttonActions!.map((action) =>
            buttonActionByType[action.type](action),
          ),
          delayMessage: input.delayMessage,
          title: input.title,
          footer: input.footer,
        }),
        [NotificationType.BUTTON_OTP]: (): SendNotificationJobData => ({
          notificationId: created.id,
          type: NotificationType.BUTTON_OTP,
          code: input.code!,
          image: input.image,
          buttonText: input.buttonText,
        }),
        [NotificationType.BUTTON_PIX]: (): SendNotificationJobData => ({
          notificationId: created.id,
          type: NotificationType.BUTTON_PIX,
          pixKey: input.pixKey!,
          pixType: input.pixType!,
          merchantName: input.merchantName,
        }),
      };

      const jobData = jobDataByType[input.type]();

      await this.queue.enqueueSendNotification(jobData);

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
