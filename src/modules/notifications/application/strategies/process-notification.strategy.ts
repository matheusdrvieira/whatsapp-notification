import { Injectable } from '@nestjs/common';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationType } from '../../domain/enums/notification-type.enum';
import { WhatsappRepository } from '../../domain/repositories/whatsapp.repository';
import type {
  SendButtonActionsInput,
  SendButtonOtpInput,
  SendButtonPixInput,
  SendNotificationInput,
  SendTextInput,
} from '../../domain/types/queue.types';

@Injectable()
export class ProcessNotificationStrategy {
  constructor(private readonly whatsappProvider: WhatsappRepository) { }

  get(type: NotificationType): (input: SendNotificationInput, notification: Notification) => Promise<void> {
    const handlers: Partial<Record<NotificationType, (input: SendNotificationInput, notification: Notification) => Promise<void>>> = {
      [NotificationType.SEND_TEXT]: async (_: SendTextInput, notification: Notification) => {
        await this.whatsappProvider.sendText({
          to: notification.to,
          message: notification.message,
        });
      },
      [NotificationType.BUTTON_ACTIONS]: async (input: SendButtonActionsInput, notification: Notification) => {
        await this.whatsappProvider.sendButtonActions({
          to: notification.to,
          message: notification.message,
          buttonActions: input.buttonActions,
          delayMessage: input.delayMessage,
          title: input.title,
          footer: input.footer,
        });
      },
      [NotificationType.BUTTON_OTP]: async (input: SendButtonOtpInput, notification: Notification) => {
        await this.whatsappProvider.sendButtonOtp({
          to: notification.to,
          message: notification.message,
          code: input.code,
          image: input.image,
          buttonText: input.buttonText,
        });
      },
      [NotificationType.BUTTON_PIX]: async (input: SendButtonPixInput, notification: Notification) => {
        await this.whatsappProvider.sendButtonPix({
          to: notification.to,
          pixKey: input.pixKey,
          pixType: input.pixType,
          merchantName: input.merchantName,
        });
      },
    };

    const handler = handlers[type];
    if (!handler) throw new Error(`ProcessNotification handler ${type} não implementado.`);

    return handler;
  }
}
