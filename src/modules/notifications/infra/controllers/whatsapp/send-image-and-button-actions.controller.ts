import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
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

            console.log({
                to: body.to,
                image: body.image,
                buttonsMessage: body.buttonsMessage,
                buttonActions,
                delayMessage: body.delayMessage,
                title: body.title,
                footer: body.footer,
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

            return {
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
            };
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }
}
