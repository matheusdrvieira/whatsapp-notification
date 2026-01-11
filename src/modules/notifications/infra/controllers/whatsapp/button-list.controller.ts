import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Logger } from '../../../../../shared/logger/logger.service';
import { ProcessNotificationUseCase } from '../../../application/use-cases/process-notification.use-case';
import { NotificationType } from '../../../domain/enums/notification-type.enum';
import { CreateWhatsappButtonListNotificationDto } from '../../dto/create-whatsapp-button-list-notification.dto';

@ApiTags('Notifications - Button List')
@ApiSecurity('api-key')
@Controller('v1/notifications')
export class WhatsappButtonListNotificationsController {
  constructor(
    private readonly processNotification: ProcessNotificationUseCase,
    private readonly logger: Logger,
  ) { }

  @Post('whatsapp/button-list')
  async createWhatsappButtonList(
    @Body() body: CreateWhatsappButtonListNotificationDto,
    @Res() res: Response,
  ) {
    try {
      const buttonList = {
        image: body.buttonList.image,
        buttons: body.buttonList.buttons.map((button) => ({
          id: button.id,
          label: button.label,
        })),
      };

      const notification = await this.processNotification.execute({
        type: NotificationType.BUTTON_LIST,
        phone: body.phone,
        message: body.message,
        buttonList,
        delayMessage: body.delayMessage,
      });

      return res.status(HttpStatus.CREATED).send({
        id: notification.id,
        phone: notification.phone,
        messageId: notification.messageId,
        status: notification.status,
        createdAt: notification.createdAt,
      });
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
