import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullMqModule } from '../../shared/bullmq/bullmq.module';
import { CreateWhatsappButtonActionsNotificationUseCase } from './application/use-cases/create-whatsapp-button-actions-notification.use-case';
import { CreateWhatsappButtonOtpNotificationUseCase } from './application/use-cases/create-whatsapp-button-otp-notification.use-case';
import { CreateWhatsappButtonPixNotificationUseCase } from './application/use-cases/create-whatsapp-button-pix-notification.use-case';
import { CreateWhatsappSendTextNotificationUseCase } from './application/use-cases/create-whatsapp-send-text-notification.use-case';
import { ProcessWhatsappButtonActionsNotificationUseCase } from './application/use-cases/process-whatsapp-button-actions-notification.use-case';
import { ProcessWhatsappButtonOtpNotificationUseCase } from './application/use-cases/process-whatsapp-button-otp-notification.use-case';
import { ProcessWhatsappButtonPixNotificationUseCase } from './application/use-cases/process-whatsapp-button-pix-notification.use-case';
import { ProcessWhatsappSendTextNotificationUseCase } from './application/use-cases/process-whatsapp-send-text-notification.use-case';
import { NotificationRepository } from './domain/repositories/notification.repository';
import { QueueRepository } from './domain/repositories/queue.repository';
import { WhatsappTextNotificationsController } from './infra/controllers/whatsapp-send-text.controller';
import { WhatsappButtonActionsNotificationsController } from './infra/controllers/whatsapp-button-actions.controller';
import { WhatsappButtonOtpNotificationsController } from './infra/controllers/whatsapp-button-otp.controller';
import { WhatsappButtonPixNotificationsController } from './infra/controllers/whatsapp-button-pix.controller';
import { NotificationPrismaRepository } from './infra/prisma/notification.prisma-repository';
import { PrismaService } from './infra/prisma/prisma.service';
import { ServiceModule } from './infra/services/service.module';
import { BullMqAdapter } from './infra/queue/bullmq.adapter';
import { SendNotificationWorker } from './infra/queue/workers/send-notification.worker';

@Module({
  imports: [ConfigModule, BullMqModule, ServiceModule],
  controllers: [
    WhatsappTextNotificationsController,
    WhatsappButtonActionsNotificationsController,
    WhatsappButtonOtpNotificationsController,
    WhatsappButtonPixNotificationsController,
  ],
  providers: [
    Logger,
    PrismaService,
    CreateWhatsappSendTextNotificationUseCase,
    CreateWhatsappButtonActionsNotificationUseCase,
    CreateWhatsappButtonOtpNotificationUseCase,
    CreateWhatsappButtonPixNotificationUseCase,
    ProcessWhatsappSendTextNotificationUseCase,
    ProcessWhatsappButtonActionsNotificationUseCase,
    ProcessWhatsappButtonOtpNotificationUseCase,
    ProcessWhatsappButtonPixNotificationUseCase,
    SendNotificationWorker,
    BullMqAdapter,
    {
      provide: NotificationRepository,
      useClass: NotificationPrismaRepository,
    },
    {
      provide: QueueRepository,
      useExisting: BullMqAdapter,
    },
  ],
})
export class NotificationsModule {}
