import { Body, Controller, Post } from '@nestjs/common';
import { AppLogger } from '../../../../shared/logger/app-logger.service';
import { CreateWhatsappButtonPixNotificationUseCase } from '../../application/use-cases/create-whatsapp-button-pix-notification.use-case';
import { CreateWhatsappButtonPixNotificationDto } from '../dto/create-whatsapp-button-pix-notification.dto';

@Controller('v1/notifications')
export class WhatsappButtonPixNotificationsController {
  constructor(
    private readonly createWhatsappButtonPixUseCase: CreateWhatsappButtonPixNotificationUseCase,
    private readonly logger: AppLogger,
  ) {}

  @Post('whatsapp/button-pix')
  async createWhatsappButtonPix(@Body() body: CreateWhatsappButtonPixNotificationDto) {
    try {
      const notification = await this.createWhatsappButtonPixUseCase.execute({
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
