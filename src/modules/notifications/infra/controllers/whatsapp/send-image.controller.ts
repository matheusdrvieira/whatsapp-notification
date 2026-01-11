import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Logger } from '../../../../../shared/logger/logger.service';
import { ProcessNotificationUseCase } from '../../../application/use-cases/process-notification.use-case';
import { NotificationType } from '../../../domain/enums/notification-type.enum';
import { CreateWhatsappImageNotificationDto } from '../../dto/create-whatsapp-image-notification.dto';

@ApiTags('Notifications - Image')
@ApiSecurity('api-key')
@Controller('v1/notifications')
export class WhatsappImageNotificationsController {
  constructor(
    private readonly processNotification: ProcessNotificationUseCase,
    private readonly logger: Logger,
  ) { }

  @Post('whatsapp/send-image')
  async createWhatsappImage(
    @Body() body: CreateWhatsappImageNotificationDto,
    @Res() res: Response,
  ) {
    try {
      const notification = await this.processNotification.execute({
        type: NotificationType.SEND_IMAGE,
        phone: body.phone,
        caption: body.caption,
        image: body.image,
        messageId: body.messageId,
        delayMessage: body.delayMessage,
        viewOnce: body.viewOnce,
      });

      return res.status(HttpStatus.CREATED).send({
        id: notification.id,
        phone: notification.phone,
        messageId: notification.messageId,
        status: notification.status,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      });
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
