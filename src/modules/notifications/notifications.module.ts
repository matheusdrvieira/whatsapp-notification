import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullMqModule } from '../../shared/bullmq/bullmq.module';
import { CreateNotificationStrategy } from './application/strategies/create-notification.strategy';
import { ProcessNotificationStrategy } from './application/strategies/process-notification.strategy';
import { CreateNotificationUseCase } from './application/use-cases/create-notification.use-case';
import { ProcessNotificationUseCase } from './application/use-cases/process-notification.use-case';
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
    PrismaService,
    CreateNotificationStrategy,
    ProcessNotificationStrategy,
    CreateNotificationUseCase,
    ProcessNotificationUseCase,
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
