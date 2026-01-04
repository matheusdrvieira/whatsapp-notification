import { Body, Controller, Post } from '@nestjs/common';
import { CreateWhatsappButtonPixNotificationUseCase } from '../../application/use-cases/create-whatsapp-button-pix-notification.use-case';
import { CreateWhatsappButtonPixNotificationDto } from '../dto/create-whatsapp-button-pix-notification.dto';

@Controller('v1/notifications')
export class WhatsappButtonPixNotificationsController {
  constructor(
    private readonly createWhatsappButtonPixUseCase: CreateWhatsappButtonPixNotificationUseCase,
  ) {}

  @Post('whatsapp/button-pix')
  async createWhatsappButtonPix(@Body() body: CreateWhatsappButtonPixNotificationDto) {
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
  }
}
