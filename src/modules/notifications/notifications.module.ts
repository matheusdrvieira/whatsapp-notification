import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AxiosModule } from '../../shared/axios/axios.module';
import { ProcessNotificationStrategy } from './application/strategies/process-notification.strategy';
import { CreateNotificationUseCase } from './application/use-cases/create-notification.use-case';
import { ProcessNotificationUseCase } from './application/use-cases/process-notification.use-case';
import { SendTextAndButtonActionsUseCase } from './application/use-cases/send-text-and-button-actions.use-case';
import { NotificationRepository } from './domain/repositories/notification.repository';
import { WhatsappButtonActionsNotificationsController } from './infra/controllers/whatsapp/button-actions.controller';
import { WhatsappButtonListNotificationsController } from './infra/controllers/whatsapp/button-list.controller';
import { WhatsappButtonOtpNotificationsController } from './infra/controllers/whatsapp/button-otp.controller';
import { WhatsappButtonPixNotificationsController } from './infra/controllers/whatsapp/button-pix.controller';
import { WhatsappImageAndButtonActionsNotificationsController } from './infra/controllers/whatsapp/send-image-and-button-actions.controller';
import { WhatsappImageNotificationsController } from './infra/controllers/whatsapp/send-image.controller';
import { WhatsappTextNotificationsController } from './infra/controllers/whatsapp/send-text.controller';
import { ZapiDisconnectedWebhookController } from './infra/controllers/whatsapp/webhook/disconnected.controller';
import { NotificationPrismaRepository } from './infra/prisma/notification.prisma-repository';
import { PrismaService } from './infra/prisma/prisma.service';
import { DiscordService } from './infra/services/discord.service';
import { ServiceModule } from './infra/services/service.module';

@Module({
  imports: [ConfigModule, ServiceModule, AxiosModule],
  controllers: [
    WhatsappTextNotificationsController,
    WhatsappImageNotificationsController,
    WhatsappImageAndButtonActionsNotificationsController,
    WhatsappButtonActionsNotificationsController,
    WhatsappButtonListNotificationsController,
    WhatsappButtonOtpNotificationsController,
    WhatsappButtonPixNotificationsController,
    ZapiDisconnectedWebhookController,
  ],
  providers: [
    PrismaService,
    ProcessNotificationStrategy,
    CreateNotificationUseCase,
    ProcessNotificationUseCase,
    SendTextAndButtonActionsUseCase,
    DiscordService,
    {
      provide: NotificationRepository,
      useClass: NotificationPrismaRepository,
    },
  ],
  exports: [
    ProcessNotificationUseCase,
    NotificationRepository,
    ProcessNotificationStrategy,
  ],
})
export class NotificationsModule { }
