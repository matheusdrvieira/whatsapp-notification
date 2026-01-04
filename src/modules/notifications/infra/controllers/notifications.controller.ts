import { Body, Controller, Post } from '@nestjs/common';
import { AppLogger } from '../../../../shared/logger/app-logger.service';
import { CreateWhatsappSendTextNotificationUseCase } from '../../application/use-cases/create-whatsapp-send-text-notification.use-case';
import { CreateWhatsappTextNotificationDto } from '../dto/create-whatsapp-text-notification.dto';

@Controller('v1/notifications')
export class WhatsappTextNotificationsController {
  constructor(
    private readonly createNotification: CreateWhatsappSendTextNotificationUseCase,
    private readonly logger: AppLogger,
  ) { }

  @Post('whatsapp/send-text')
  async createWhatsapp(
    @Body() body: CreateWhatsappTextNotificationDto,
  ) {
    try {
      const notification = await this.createNotification.execute({
        to: body.to,
        message: body.message,
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
