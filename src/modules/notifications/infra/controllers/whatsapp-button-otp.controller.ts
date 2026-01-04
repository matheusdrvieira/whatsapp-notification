import { Body, Controller, Post } from '@nestjs/common';
import { AppLogger } from '../../../../shared/logger/app-logger.service';
import { CreateWhatsappButtonOtpNotificationUseCase } from '../../application/use-cases/create-whatsapp-button-otp-notification.use-case';
import { CreateWhatsappButtonOtpNotificationDto } from '../dto/create-whatsapp-button-otp-notification.dto';

@Controller('v1/notifications')
export class WhatsappButtonOtpNotificationsController {
  constructor(
    private readonly createWhatsappButtonOtpUseCase: CreateWhatsappButtonOtpNotificationUseCase,
    private readonly logger: AppLogger,
  ) {}

  @Post('whatsapp/button-otp')
  async createWhatsappButtonOtp(@Body() body: CreateWhatsappButtonOtpNotificationDto) {
    try {
      const notification = await this.createWhatsappButtonOtpUseCase.execute({
        to: body.to,
        message: body.message,
        code: body.code,
        image: body.image,
        buttonText: body.buttonText,
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
