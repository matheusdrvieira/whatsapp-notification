import { Body, Controller, Post } from '@nestjs/common';
import { CreateWhatsappButtonOtpNotificationUseCase } from '../../application/use-cases/create-whatsapp-button-otp-notification.use-case';
import { CreateWhatsappButtonOtpNotificationDto } from '../dto/create-whatsapp-button-otp-notification.dto';

@Controller('v1/notifications')
export class WhatsappButtonOtpNotificationsController {
  constructor(
    private readonly createWhatsappButtonOtpUseCase: CreateWhatsappButtonOtpNotificationUseCase,
  ) {}

  @Post('whatsapp/button-otp')
  async createWhatsappButtonOtp(@Body() body: CreateWhatsappButtonOtpNotificationDto) {
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
  }
}
