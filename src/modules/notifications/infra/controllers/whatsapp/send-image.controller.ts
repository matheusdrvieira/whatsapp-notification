import { Body, Controller, Post } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AppLogger } from '../../../../../shared/logger/app-logger.service';
import { CreateNotificationUseCase } from '../../../application/use-cases/create-notification.use-case';
import { NotificationType } from '../../../domain/enums/notification-type.enum';
import { CreateWhatsappImageNotificationDto } from '../../dto/create-whatsapp-image-notification.dto';

@ApiTags('Notifications - Image')
@ApiSecurity('api-key')
@Controller('v1/notifications')
export class WhatsappImageNotificationsController {
  constructor(
    private readonly createNotification: CreateNotificationUseCase,
    private readonly logger: AppLogger,
  ) { }

  @Post('whatsapp/send-image')
  async createWhatsappImage(@Body() body: CreateWhatsappImageNotificationDto) {
    try {
      const notification = await this.createNotification.execute({
        type: NotificationType.SEND_IMAGE,
        to: body.to,
        message: body.caption,
        image: body.image,
        messageId: body.messageId,
        delayMessage: body.delayMessage,
        viewOnce: body.viewOnce,
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
