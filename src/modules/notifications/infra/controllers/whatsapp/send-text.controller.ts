import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Logger } from '../../../../../shared/logger/logger.service';
import { ProcessNotificationUseCase } from '../../../application/use-cases/process-notification.use-case';
import { NotificationType } from '../../../domain/enums/notification-type.enum';
import { CreateWhatsappTextNotificationDto } from '../../dto/create-whatsapp-text-notification.dto';

@ApiTags('Notifications - Text')
@ApiSecurity('api-key')
@Controller('v1/notifications')
export class WhatsappTextNotificationsController {
  constructor(
    private readonly processNotification: ProcessNotificationUseCase,
    private readonly logger: Logger,
  ) { }

  @Post('whatsapp/send-text')
  async createWhatsapp(
    @Body() body: CreateWhatsappTextNotificationDto,
    @Res() res: Response,
  ) {
    try {
      const notification = await this.processNotification.execute({
        type: NotificationType.SEND_TEXT,
        phone: body.phone,
        message: body.message,
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
