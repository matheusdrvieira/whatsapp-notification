import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
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
    @Res() res: Response,
  ) {
    try {
      const actionMappers: Record<string, (a: any) => WhatsappButtonAction> = {
        CALL: (a) => ({ id: a.id, type: 'CALL', phone: a.phone, label: a.label }),
        URL: (a) => ({ id: a.id, type: 'URL', url: a.url, label: a.label }),
        REPLY: (a) => ({ id: a.id, type: 'REPLY', label: a.label }),
      };

      const buttonActions: WhatsappButtonAction[] = body.buttonActions.map((action) => {
        const mapper = actionMappers[action.type];
        return mapper(action);
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

      return res.status(HttpStatus.CREATED).send({
        id: notification.id,
        to: notification.to,
        messageId,
        status: notification.status,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      });
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
