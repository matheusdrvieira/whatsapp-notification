import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { AppLogger } from '../../../../../shared/logger/app-logger.service';
import { SendTextAndButtonActionsUseCase } from '../../../application/use-cases/send-text-and-button-actions.use-case';
import type { WhatsappButtonAction } from '../../../domain/types/whatsapp.types';
import { CreateWhatsappImageAndButtonActionsNotificationDto } from '../../dto/create-whatsapp-image-and-button-actions-notification.dto';

@ApiTags('Notifications - Image + Button Actions')
@ApiSecurity('api-key')
@Controller('v1/notifications')
export class WhatsappImageAndButtonActionsNotificationsController {
    constructor(
        private readonly sendUseCase: SendTextAndButtonActionsUseCase,
        private readonly logger: AppLogger,
    ) { }

    @Post('whatsapp/send-image-and-button-actions')
    async sendImageAndButtonActions(
        @Body() body: CreateWhatsappImageAndButtonActionsNotificationDto,
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

            const result = await this.sendUseCase.execute({
                to: body.to,
                image: body.image,
                buttonsMessage: body.buttonsMessage,
                buttonActions,
                delayMessage: body.delayMessage,
                title: body.title,
                footer: body.footer,
            });

            return res.status(HttpStatus.CREATED).send({
                image: {
                    id: result.image.notification.id,
                    to: result.image.notification.to,
                    messageId: result.image.messageId,
                    status: result.image.notification.status,
                    createdAt: result.image.notification.createdAt,
                },
                buttonActions: {
                    id: result.buttonActions.notification.id,
                    to: result.buttonActions.notification.to,
                    messageId: result.buttonActions.messageId,
                    status: result.buttonActions.notification.status,
                    createdAt: result.buttonActions.notification.createdAt,
                },
            });
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }
}
