import { Body, Controller, Post } from '@nestjs/common';
import { AppLogger } from '../../../../shared/logger/app-logger.service';
import { CreateNotificationUseCase } from '../../application/use-cases/create-notification.use-case';
import { NotificationType } from '../../domain/enums/notification-type.enum';
import { CreateWhatsappButtonPixNotificationDto } from '../dto/create-whatsapp-button-pix-notification.dto';

@Controller('v1/notifications')
export class WhatsappButtonPixNotificationsController {
  constructor(
    private readonly createNotification: CreateNotificationUseCase,
    private readonly logger: AppLogger,
  ) {}

  @Post('whatsapp/button-pix')
  async createWhatsappButtonPix(@Body() body: CreateWhatsappButtonPixNotificationDto) {
    try {
      const notification = await this.createNotification.execute({
        type: NotificationType.BUTTON_PIX,
        to: body.to,
        pixKey: body.pixKey,
        pixType: body.pixType,
        merchantName: body.merchantName,
      });

      return {
        id: notification.id,
        to: notification.to,
        message: notification.message,
        status: notification.status,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
