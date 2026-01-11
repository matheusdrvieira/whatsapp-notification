import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Logger } from '../../../../shared/logger/logger.service';
import { NotificationType } from '../../domain/enums/notification-type.enum';
import type {
  SendImageAndButtonActionsInput,
  SendImageAndButtonActionsResult,
} from '../../domain/types/send.types';
import { ProcessNotificationUseCase } from './process-notification.use-case';

@Injectable()
export class SendTextAndButtonActionsUseCase {
  constructor(
    private readonly processNotification: ProcessNotificationUseCase,
    private readonly logger: Logger,
  ) { }

  async execute(
    input: SendImageAndButtonActionsInput,
  ): Promise<SendImageAndButtonActionsResult> {
    try {
      const imageResult = await this.processNotification.execute({
        type: NotificationType.SEND_IMAGE,
        phone: input.to,
        image: input.image,
        delayMessage: input.delayMessage,
      });

      const buttonActionsResult = await this.processNotification.execute({
        type: NotificationType.BUTTON_ACTIONS,
        phone: input.to,
        message: input.buttonsMessage || '',
        buttonActions: input.buttonActions,
        delayMessage: input.delayMessage,
        title: input.title,
        footer: input.footer,
      });

      return {
        image: {
          notification: imageResult,
          messageId: imageResult.messageId,
        },
        buttonActions: {
          notification: buttonActionsResult,
          messageId: buttonActionsResult.messageId,
        },
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }
}
