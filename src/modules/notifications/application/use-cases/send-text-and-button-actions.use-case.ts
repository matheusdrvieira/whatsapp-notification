import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppLogger } from '../../../../shared/logger/app-logger.service';
import { NotificationType } from '../../domain/enums/notification-type.enum';
import type {
  SendImageAndButtonActionsInput,
  SendImageAndButtonActionsResult,
} from '../../domain/types/send.types';
import { CreateNotificationUseCase } from './create-notification.use-case';

@Injectable()
export class SendTextAndButtonActionsUseCase {
  constructor(
    private readonly createNotification: CreateNotificationUseCase,
    private readonly logger: AppLogger,
  ) { }

  async execute(
    input: SendImageAndButtonActionsInput,
  ): Promise<SendImageAndButtonActionsResult> {
    try {
      const imageResult = await this.createNotification.execute({
        type: NotificationType.SEND_IMAGE,
        to: input.to,
        image: input.image,
        delayMessage: input.delayMessage,
      });

      console.log(imageResult);


      const buttonActionsResult = await this.createNotification.execute({
        type: NotificationType.BUTTON_ACTIONS,
        to: input.to,
        message: input.buttonsMessage,
        buttonActions: input.buttonActions,
        delayMessage: input.delayMessage,
        title: input.title,
        footer: input.footer,
      });

      return {
        image: imageResult,
        buttonActions: buttonActionsResult,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }
}
