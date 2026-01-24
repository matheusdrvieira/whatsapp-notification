import { Injectable } from '@nestjs/common';

import { NotificationType } from '../../domain/enums/notification-type.enum';
import { WhatsappRepository } from '../../domain/repositories/whatsapp.repository';
import type {
  SendButtonActionsInput,
  SendButtonListInput,
  SendButtonOtpInput,
  SendButtonPixInput,
  SendDocumentInput,
  SendImageInput,
  SendNotificationInput,
  SendTextInput,
} from '../../domain/types/queue.types';
import type { WhatsappSendMessageOutput } from '../../domain/types/whatsapp.types';

@Injectable()
export class ProcessNotificationStrategy {
  constructor(private readonly whatsappProvider: WhatsappRepository) { }

  get(type: NotificationType): (input: SendNotificationInput) => Promise<WhatsappSendMessageOutput> {
    const handlers: Partial<Record<NotificationType, (input: SendNotificationInput) => Promise<WhatsappSendMessageOutput>>> = {
      [NotificationType.SEND_TEXT]: async (input: SendTextInput) => {
        return await this.whatsappProvider.sendText({
          phone: input.phone,
          message: input.message,
        });
      },
      [NotificationType.SEND_IMAGE]: async (input: SendImageInput) => {
        return await this.whatsappProvider.sendImage({
          phone: input.phone,
          image: input.image,
          caption: input.caption,
          messageId: input.messageId,
          delayMessage: input.delayMessage,
          viewOnce: input.viewOnce,
        });
      },
      [NotificationType.SEND_DOCUMENT]: async (input: SendDocumentInput) => {
        return await this.whatsappProvider.sendDocument({
          phone: input.phone,
          extension: input.extension,
          document: input.document,
          fileName: input.fileName,
          caption: input.caption,
          messageId: input.messageId,
          delayMessage: input.delayMessage,
          editDocumentMessageId: input.editDocumentMessageId,
        });
      },
      [NotificationType.BUTTON_ACTIONS]: async (input: SendButtonActionsInput) => {
        return await this.whatsappProvider.sendButtonActions({
          phone: input.phone,
          message: input.message,
          buttonActions: input.buttonActions,
          delayMessage: input.delayMessage,
          title: input.title,
          footer: input.footer,
        });
      },
      [NotificationType.BUTTON_LIST]: async (input: SendButtonListInput) => {
        return await this.whatsappProvider.sendButtonList({
          phone: input.phone,
          message: input.message,
          buttonList: input.buttonList,
          delayMessage: input.delayMessage,
        });
      },
      [NotificationType.BUTTON_OTP]: async (input: SendButtonOtpInput) => {
        return await this.whatsappProvider.sendButtonOtp({
          phone: input.phone,
          message: input.message,
          code: input.code,
          image: input.image,
          buttonText: input.buttonText,
        });
      },
      [NotificationType.BUTTON_PIX]: async (input: SendButtonPixInput) => {
        return await this.whatsappProvider.sendButtonPix({
          phone: input.phone,
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
