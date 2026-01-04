import { NotificationType } from '../enums/notification-type.enum';
import type { PixKeyType, WhatsappButtonAction } from './whatsapp.repository';

export type SendTextJobData = {
  notificationId: string;
  type: NotificationType.TEXT;
};

export type SendButtonActionsJobData = {
  notificationId: string;
  type: NotificationType.BUTTON_ACTIONS;
  buttonActions: WhatsappButtonAction[];
  delayMessage?: number;
  title?: string;
  footer?: string;
};

export type SendButtonOtpJobData = {
  notificationId: string;
  type: NotificationType.BUTTON_OTP;
  code: string;
  image?: string;
  buttonText?: string;
};

export type SendButtonPixJobData = {
  notificationId: string;
  type: NotificationType.BUTTON_PIX;
  pixKey: string;
  pixType: PixKeyType;
  merchantName?: string;
};

export type SendNotificationJobData =
  | SendTextJobData
  | SendButtonActionsJobData
  | SendButtonOtpJobData
  | SendButtonPixJobData;

export abstract class QueueRepository {
  abstract enqueueSendNotification(data: SendNotificationJobData): Promise<void>;
}
