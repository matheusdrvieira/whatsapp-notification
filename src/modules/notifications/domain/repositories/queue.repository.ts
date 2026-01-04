import { NotificationType } from '../enums/notification-type.enum';
import type { PixKeyType, WhatsappButtonAction } from './whatsapp.repository';

export type SendNotificationJobData =
  | {
      notificationId: string;
      type: NotificationType.TEXT;
    }
  | {
      notificationId: string;
      type: NotificationType.BUTTON_ACTIONS;
      buttonActions: WhatsappButtonAction[];
      delayMessage?: number;
      title?: string;
      footer?: string;
    }
  | {
      notificationId: string;
      type: NotificationType.BUTTON_OTP;
      code: string;
      image?: string;
      buttonText?: string;
    }
  | {
      notificationId: string;
      type: NotificationType.BUTTON_PIX;
      pixKey: string;
      pixType: PixKeyType;
      merchantName?: string;
    };

export abstract class QueueRepository {
  abstract enqueueSendNotification(data: SendNotificationJobData): Promise<void>;
}
