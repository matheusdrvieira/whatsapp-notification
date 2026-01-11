import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { AppLogger } from '../../../../../shared/logger/app-logger.service';
import { CreateNotificationUseCase } from '../../../application/use-cases/create-notification.use-case';
import { NotificationType } from '../../../domain/enums/notification-type.enum';
import { CreateWhatsappButtonPixNotificationDto } from '../../dto/create-whatsapp-button-pix-notification.dto';

@ApiTags('Notifications - Button Pix')
@ApiSecurity('api-key')
@Controller('v1/notifications')
export class WhatsappButtonPixNotificationsController {
  constructor(
    private readonly createNotification: CreateNotificationUseCase,
    private readonly logger: AppLogger,
  ) { }

  @Post('whatsapp/button-pix')
  async createWhatsappButtonPix(
    @Body() body: CreateWhatsappButtonPixNotificationDto,
    @Res() res: Response,
  ) {
    try {
      const { notification, messageId } = await this.createNotification.execute({
        type: NotificationType.BUTTON_PIX,
        to: body.to,
        pixKey: body.pixKey,
        pixType: body.pixType,
        merchantName: body.merchantName,
      });

      return res.status(HttpStatus.CREATED).send({
        id: notification.id,
        to: notification.to,
        messageId,
        status: notification.status,
        createdAt: notification.createdAt,
      });
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
