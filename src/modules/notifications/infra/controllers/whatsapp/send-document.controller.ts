import { Body, Controller, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Logger } from '../../../../../shared/logger/logger.service';
import { ProcessNotificationUseCase } from '../../../application/use-cases/process-notification.use-case';
import { NotificationType } from '../../../domain/enums/notification-type.enum';
import { CreateWhatsappDocumentNotificationDto } from '../../dto/create-whatsapp-document-notification.dto';

@ApiTags('Notifications - Document')
@ApiSecurity('api-key')
@Controller('v1/notifications')
export class WhatsappDocumentNotificationsController {
  constructor(
    private readonly processNotification: ProcessNotificationUseCase,
    private readonly logger: Logger,
  ) { }

  @ApiParam({
    name: 'extension',
    example: 'pdf',
    description: 'File extension without the dot (e.g. pdf, docx).',
  })
  @Post('whatsapp/send-document/:extension')
  async createWhatsappDocument(
    @Param('extension') extension: string,
    @Body() body: CreateWhatsappDocumentNotificationDto,
    @Res() res: Response,
  ) {
    try {
      const notification = await this.processNotification.execute({
        type: NotificationType.SEND_DOCUMENT,
        phone: body.phone,
        extension,
        document: body.document,
        fileName: body.fileName,
        caption: body.caption,
        messageId: body.messageId,
        delayMessage: body.delayMessage,
        editDocumentMessageId: body.editDocumentMessageId,
      });

      return res.status(HttpStatus.CREATED).send({
        id: notification.id,
        phone: notification.phone,
        messageId: notification.messageId,
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
