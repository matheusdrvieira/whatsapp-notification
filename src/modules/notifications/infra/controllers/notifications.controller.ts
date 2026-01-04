import { Body, Controller, Post } from '@nestjs/common';
import { CreateNotificationUseCase } from '../../application/use-cases/create-notification.use-case';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Controller('v1/notifications')
export class NotificationsController {
  constructor(private readonly createNotification: CreateNotificationUseCase) {}

  @Post('whatsapp')
  async createWhatsapp(
    @Body() body: CreateNotificationDto,
  ) {
    const notification = await this.createNotification.execute({
      type: body.type,
      to: body.to,
      message: body.message,
      buttonActions: body.buttonActions,
      delayMessage: body.delayMessage,
      title: body.title,
      footer: body.footer,
      code: body.code,
      image: body.image,
      buttonText: body.buttonText,
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
