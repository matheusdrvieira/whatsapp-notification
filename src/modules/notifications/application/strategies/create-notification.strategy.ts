import { Injectable } from '@nestjs/common';
import { NotificationType } from '../../domain/enums/notification-type.enum';
import type {
  SendButtonActionsInput,
  SendButtonListInput,
  SendButtonOtpInput,
  SendButtonPixInput,
  SendImageInput,
  SendNotificationInput,
  SendTextInput
} from '../../domain/types/queue.types';

@Injectable()
export class CreateNotificationStrategy {
  get(type: NotificationType,): (notificationId: string, input: SendNotificationInput) => SendNotificationInput {
    const handlers: Record<NotificationType, (notificationId: string, input: SendNotificationInput) => SendNotificationInput> = {
      [NotificationType.SEND_TEXT]: (notificationId, input: SendTextInput) => ({
        notificationId,
        type: NotificationType.SEND_TEXT,
        message: input.message,
      }),
      [NotificationType.SEND_IMAGE]: (notificationId: string, input: SendImageInput) => ({
        notificationId: notificationId,
        type: NotificationType.SEND_IMAGE,
        image: input.image,
        messageId: input.messageId,
        delayMessage: input.delayMessage,
        viewOnce: input.viewOnce,
      }),
      [NotificationType.BUTTON_ACTIONS]: (notificationId: string, input: SendButtonActionsInput) => ({
        notificationId: notificationId,
        type: NotificationType.BUTTON_ACTIONS,
        buttonActions: input.buttonActions,
        delayMessage: input.delayMessage,
        message: input.message,
        title: input.title,
        footer: input.footer,
      }),
      [NotificationType.BUTTON_LIST]: (notificationId: string, input: SendButtonListInput) => ({
        notificationId: notificationId,
        type: NotificationType.BUTTON_LIST,
        buttonList: input.buttonList,
        message: input.message,
        delayMessage: input.delayMessage,
      }),
      [NotificationType.BUTTON_OTP]: (notificationId: string, input: SendButtonOtpInput) => ({
        notificationId: notificationId,
        type: NotificationType.BUTTON_OTP,
        code: input.code,
        message: input.message,
        image: input.image,
        buttonText: input.buttonText,
      }),
      [NotificationType.BUTTON_PIX]: (notificationId: string, input: SendButtonPixInput) => ({
        notificationId: notificationId,
        type: NotificationType.BUTTON_PIX,
        pixKey: input.pixKey,
        pixType: input.pixType,
        merchantName: input.merchantName,
      }),
    };

    const handler = handlers[type];
    if (!handler) throw new Error(`CreateNotification handler ${type} não implementado.`);

    return handler;
  }
}
