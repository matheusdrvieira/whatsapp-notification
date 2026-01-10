import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AppLogger } from '../../../../../shared/logger/app-logger.service';
import { CreateNotificationUseCase } from '../../../application/use-cases/create-notification.use-case';
import { NotificationType } from '../../../domain/enums/notification-type.enum';
import type { WhatsappButtonAction } from '../../../domain/types/whatsapp.types';
import { CreateWhatsappButtonActionsNotificationDto } from '../../dto/create-whatsapp-button-actions-notification.dto';

@ApiTags('Notifications - Button Actions')
@ApiSecurity('api-key')
@Controller('v1/notifications')
export class WhatsappButtonActionsNotificationsController {
  constructor(
    private readonly createNotification: CreateNotificationUseCase,
    private readonly logger: AppLogger,
  ) { }

  @Post('whatsapp/button-actions')
  async createWhatsappButtonActions(
    @Body() body: CreateWhatsappButtonActionsNotificationDto,
  ) {
    try {
      const buttonActions: WhatsappButtonAction[] = body.buttonActions.map((action) => {
        switch (action.type) {
          case 'CALL':
            if (!action.phone) {
              throw new BadRequestException('buttonActions.phone is required for CALL');
            }
            return {
              id: action.id,
              type: 'CALL',
              phone: action.phone,
              label: action.label,
            };
          case 'URL':
            if (!action.url) {
              throw new BadRequestException('buttonActions.url is required for URL');
            }
            return {
              id: action.id,
              type: 'URL',
              url: action.url,
              label: action.label,
            };
          case 'REPLY':
          default:
            return {
              id: action.id,
              type: 'REPLY',
              label: action.label,
            };
        }
      });

      const { notification, messageId } = await this.createNotification.execute({
        type: NotificationType.BUTTON_ACTIONS,
        to: body.to,
        message: body.message,
        buttonActions,
        delayMessage: body.delayMessage,
        title: body.title,
        footer: body.footer,
      });

      return {
        id: notification.id,
        to: notification.to,
        messageId,
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
