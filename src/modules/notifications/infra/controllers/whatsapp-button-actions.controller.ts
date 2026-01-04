import { Body, Controller, Post } from '@nestjs/common';
import { AppLogger } from '../../../../shared/logger/app-logger.service';
import { CreateWhatsappButtonActionsNotificationUseCase } from '../../application/use-cases/create-whatsapp-button-actions-notification.use-case';
import { CreateWhatsappButtonActionsNotificationDto } from '../dto/create-whatsapp-button-actions-notification.dto';

@Controller('v1/notifications')
export class WhatsappButtonActionsNotificationsController {
  constructor(
    private readonly createWhatsappButtonActionsUseCase: CreateWhatsappButtonActionsNotificationUseCase,
    private readonly logger: AppLogger,
  ) {}

  @Post('whatsapp/button-actions')
  async createWhatsappButtonActions(
    @Body() body: CreateWhatsappButtonActionsNotificationDto,
  ) {
    try {
      const notification = await this.createWhatsappButtonActionsUseCase.execute({
        to: body.to,
        message: body.message,
        buttonActions: body.buttonActions,
        delayMessage: body.delayMessage,
        title: body.title,
        footer: body.footer,
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
