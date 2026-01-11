import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { AppLogger } from '../../../../../shared/logger/app-logger.service';
import { CreateNotificationUseCase } from '../../../application/use-cases/create-notification.use-case';
import { NotificationType } from '../../../domain/enums/notification-type.enum';
import { CreateWhatsappButtonOtpNotificationDto } from '../../dto/create-whatsapp-button-otp-notification.dto';

@ApiTags('Notifications - Button OTP')
@ApiSecurity('api-key')
@Controller('v1/notifications')
export class WhatsappButtonOtpNotificationsController {
  constructor(
    private readonly createNotification: CreateNotificationUseCase,
    private readonly logger: AppLogger,
  ) { }

  @Post('whatsapp/button-otp')
  async createWhatsappButtonOtp(
    @Body() body: CreateWhatsappButtonOtpNotificationDto,
    @Res() res: Response,
  ) {
    try {
      const { notification, messageId } = await this.createNotification.execute({
        type: NotificationType.BUTTON_OTP,
        to: body.to,
        message: body.message,
        code: body.code,
        image: body.image,
        buttonText: body.buttonText,
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
