import { Body, Controller, Post } from '@nestjs/common';
import { CreateWhatsappSendTextNotificationUseCase } from '../../application/use-cases/create-whatsapp-send-text-notification.use-case';
import { CreateWhatsappTextNotificationDto } from '../dto/create-whatsapp-text-notification.dto';

@Controller('v1/notifications')
export class WhatsappTextNotificationsController {
  constructor(
    private readonly createWhatsappSendText: CreateWhatsappSendTextNotificationUseCase,
  ) {}

  @Post('whatsapp/send-text')
  async createWhatsapp(
    @Body() body: CreateWhatsappTextNotificationDto,
  ) {
    const notification = await this.createWhatsappSendText.execute({
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
  }
}
