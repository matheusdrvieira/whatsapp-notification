import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Logger } from '../../../../../shared/logger/logger.service';
import { ProcessNotificationUseCase } from '../../../application/use-cases/process-notification.use-case';
import { NotificationType } from '../../../domain/enums/notification-type.enum';
import { CreateWhatsappButtonOtpNotificationDto } from '../../dto/create-whatsapp-button-otp-notification.dto';

@ApiTags('Notifications - Button OTP')
@ApiSecurity('api-key')
@Controller('v1/notifications')
export class WhatsappButtonOtpNotificationsController {
  constructor(
    private readonly processNotification: ProcessNotificationUseCase,
    private readonly logger: Logger,
  ) { }

  @Post('whatsapp/button-otp')
  async createWhatsappButtonOtp(
    @Body() body: CreateWhatsappButtonOtpNotificationDto,
    @Res() res: Response,
  ) {
    try {
      const notification = await this.processNotification.execute({
        type: NotificationType.BUTTON_OTP,
        phone: body.phone,
        message: body.message,
        code: body.code,
        image: body.image,
        buttonText: body.buttonText,
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
