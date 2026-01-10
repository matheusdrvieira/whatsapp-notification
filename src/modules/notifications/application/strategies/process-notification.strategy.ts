import { Injectable } from '@nestjs/common';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationType } from '../../domain/enums/notification-type.enum';
import { WhatsappRepository } from '../../domain/repositories/whatsapp.repository';
import type {
  SendButtonActionsInput,
  SendButtonListInput,
  SendButtonOtpInput,
  SendButtonPixInput,
  SendImageInput,
  SendNotificationInput,
  SendTextInput,
} from '../../domain/types/queue.types';
import type { WhatsappSendMessageOutput } from '../../domain/types/whatsapp.types';

@Injectable()
export class ProcessNotificationStrategy {
  constructor(private readonly whatsappProvider: WhatsappRepository) { }

  get(type: NotificationType): (input: SendNotificationInput, notification: Notification) => Promise<WhatsappSendMessageOutput> {
    const handlers: Partial<Record<NotificationType, (input: SendNotificationInput, notification: Notification) => Promise<WhatsappSendMessageOutput>>> = {
      [NotificationType.SEND_TEXT]: async (input: SendTextInput, notification: Notification) => {
        return await this.whatsappProvider.sendText({
          to: notification.to,
          message: input.message,
        });
      },
      [NotificationType.SEND_IMAGE]: async (input: SendImageInput, notification: Notification) => {
        return await this.whatsappProvider.sendImage({
          to: notification.to,
          image: input.image,
          caption: input.caption,
          messageId: input.messageId,
          delayMessage: input.delayMessage,
          viewOnce: input.viewOnce,
        });
      },
      [NotificationType.BUTTON_ACTIONS]: async (input: SendButtonActionsInput, notification: Notification) => {
        return await this.whatsappProvider.sendButtonActions({
          to: notification.to,
          message: input.message,
          buttonActions: input.buttonActions,
          delayMessage: input.delayMessage,
          title: input.title,
          footer: input.footer,
        });
      },
      [NotificationType.BUTTON_LIST]: async (input: SendButtonListInput, notification: Notification) => {
        return await this.whatsappProvider.sendButtonList({
          to: notification.to,
          message: input.message,
          buttonList: input.buttonList,
          delayMessage: input.delayMessage,
        });
      },
      [NotificationType.BUTTON_OTP]: async (input: SendButtonOtpInput, notification: Notification) => {
        return await this.whatsappProvider.sendButtonOtp({
          to: notification.to,
          message: input.message,
          code: input.code,
          image: input.image,
          buttonText: input.buttonText,
        });
      },
      [NotificationType.BUTTON_PIX]: async (input: SendButtonPixInput, notification: Notification) => {
        return await this.whatsappProvider.sendButtonPix({
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
