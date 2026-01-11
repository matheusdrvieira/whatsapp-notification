import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Logger } from '../../../../../shared/logger/logger.service';
import { ProcessNotificationUseCase } from '../../../application/use-cases/process-notification.use-case';
import { NotificationType } from '../../../domain/enums/notification-type.enum';
import { CreateWhatsappButtonPixNotificationDto } from '../../dto/create-whatsapp-button-pix-notification.dto';

@ApiTags('Notifications - Button Pix')
@ApiSecurity('api-key')
@Controller('v1/notifications')
export class WhatsappButtonPixNotificationsController {
  constructor(
    private readonly processNotification: ProcessNotificationUseCase,
    private readonly logger: Logger,
  ) { }

  @Post('whatsapp/button-pix')
  async createWhatsappButtonPix(
    @Body() body: CreateWhatsappButtonPixNotificationDto,
    @Res() res: Response,
  ) {
    try {
      const notification = await this.processNotification.execute({
        type: NotificationType.BUTTON_PIX,
        phone: body.phone,
        pixKey: body.pixKey,
        pixType: body.pixType,
        merchantName: body.merchantName,
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
