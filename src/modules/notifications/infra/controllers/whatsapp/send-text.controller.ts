import { Body, Controller, Post } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AppLogger } from '../../../../../shared/logger/app-logger.service';
import { CreateNotificationUseCase } from '../../../application/use-cases/create-notification.use-case';
import { NotificationType } from '../../../domain/enums/notification-type.enum';
import { CreateWhatsappTextNotificationDto } from '../../dto/create-whatsapp-text-notification.dto';

@ApiTags('Notifications - Text')
@ApiSecurity('api-key')
@Controller('v1/notifications')
export class WhatsappTextNotificationsController {
  constructor(
    private readonly createNotification: CreateNotificationUseCase,
    private readonly logger: AppLogger,
  ) { }

  @Post('whatsapp/send-text')
  async createWhatsapp(
    @Body() body: CreateWhatsappTextNotificationDto,
  ) {
    try {
      const { notification, messageId } = await this.createNotification.execute({
        type: NotificationType.SEND_TEXT,
        to: body.to,
        message: body.message,
      });

      return {
        id: notification.id,
        to: notification.to,
        messageId,
        status: notification.status,
        createdAt: notification.createdAt
      };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
