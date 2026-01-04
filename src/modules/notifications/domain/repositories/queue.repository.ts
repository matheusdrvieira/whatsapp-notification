import { NotificationType } from '../enums/notification-type.enum';
import type { PixKeyType, WhatsappButtonAction } from './whatsapp.repository';

export type SendTextInput = {
  notificationId: string;
  type: NotificationType.TEXT;
};

export type SendButtonActionsInput = {
  notificationId: string;
  type: NotificationType.BUTTON_ACTIONS;
  buttonActions: WhatsappButtonAction[];
  delayMessage?: number;
  title?: string;
  footer?: string;
};

export type SendButtonOtpInput = {
  notificationId: string;
  type: NotificationType.BUTTON_OTP;
  code: string;
  image?: string;
  buttonText?: string;
};

export type SendButtonPixInput = {
  notificationId: string;
  type: NotificationType.BUTTON_PIX;
  pixKey: string;
  pixType: PixKeyType;
  merchantName?: string;
};

export type SendNotificationInput =
  | SendTextInput
  | SendButtonActionsInput
  | SendButtonOtpInput
  | SendButtonPixInput;

export abstract class QueueRepository {
  abstract enqueueSendNotification(data: SendNotificationInput): Promise<void>;
}
