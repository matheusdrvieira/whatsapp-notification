import { NotificationType } from '../enums/notification-type.enum';
import type { PixKeyType, WhatsappButtonAction, WhatsappButtonList } from './whatsapp.types';

export type SendTextInput = {
  notificationId: string;
  type: NotificationType.SEND_TEXT;
  message: string;
};

export type SendImageInput = {
  notificationId: string;
  type: NotificationType.SEND_IMAGE;
  image: string;
  messageId?: string;
  delayMessage?: number;
  viewOnce?: boolean;
  caption?: string;
};

export type SendButtonActionsInput = {
  notificationId: string;
  type: NotificationType.BUTTON_ACTIONS;
  buttonActions: WhatsappButtonAction[];
  delayMessage?: number;
  message: string;
  title?: string;
  footer?: string;
};

export type SendButtonListInput = {
  notificationId: string;
  type: NotificationType.BUTTON_LIST;
  buttonList: WhatsappButtonList;
  message: string;
  delayMessage?: number;
};

export type SendButtonOtpInput = {
  notificationId: string;
  type: NotificationType.BUTTON_OTP;
  message: string;
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
  | SendImageInput
  | SendButtonActionsInput
  | SendButtonListInput
  | SendButtonOtpInput
  | SendButtonPixInput;
