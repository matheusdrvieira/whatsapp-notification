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
  get(type: NotificationType,): (createdId: string, input: SendNotificationInput) => SendNotificationInput {
    const handlers: Record<NotificationType, (createdId: string, input: SendNotificationInput) => SendNotificationInput> = {
      [NotificationType.SEND_TEXT]: (createdId, _input: SendTextInput) => ({
        notificationId: createdId,
        type: NotificationType.SEND_TEXT,
      }),
      [NotificationType.SEND_IMAGE]: (createdId, input: SendImageInput) => ({
        notificationId: createdId,
        type: NotificationType.SEND_IMAGE,
        image: input.image,
        messageId: input.messageId,
        delayMessage: input.delayMessage,
        viewOnce: input.viewOnce,
      }),
      [NotificationType.BUTTON_ACTIONS]: (createdId, input: SendButtonActionsInput) => ({
        notificationId: createdId,
        type: NotificationType.BUTTON_ACTIONS,
        buttonActions: input.buttonActions,
        delayMessage: input.delayMessage,
        title: input.title,
        footer: input.footer,
      }),
      [NotificationType.BUTTON_LIST]: (createdId, input: SendButtonListInput) => ({
        notificationId: createdId,
        type: NotificationType.BUTTON_LIST,
        buttonList: input.buttonList,
        delayMessage: input.delayMessage,
      }),
      [NotificationType.BUTTON_OTP]: (createdId, input: SendButtonOtpInput) => ({
        notificationId: createdId,
        type: NotificationType.BUTTON_OTP,
        code: input.code,
        image: input.image,
        buttonText: input.buttonText,
      }),
      [NotificationType.BUTTON_PIX]: (createdId, input: SendButtonPixInput) => ({
        notificationId: createdId,
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
