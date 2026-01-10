import type { Notification } from '../entities/notification.entity';
import type { WhatsappButtonAction } from './whatsapp.types';

export type SendImageAndButtonActionsInput = {
  to: string;
  image: string;
  buttonsMessage?: string;
  buttonActions: WhatsappButtonAction[];
  delayMessage?: number;
  title?: string;
  footer?: string;
};

export type SendImageAndButtonActionsResult = {
  image: {
    notification: Notification;
    messageId: string | null;
  };
  buttonActions: {
    notification: Notification;
    messageId: string | null;
  };
};
