import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullMqModule } from '../../shared/bullmq/bullmq.module';
import { CreateNotificationUseCase } from './application/use-cases/create-notification.use-case';
import { ProcessNotificationUseCase } from './application/use-cases/process-notification.use-case';
import { NotificationRepository } from './domain/repositories/notification.repository';
import { QueueRepository } from './domain/repositories/queue.repository';
import { NotificationsController } from './infra/controllers/notifications.controller';
import { NotificationPrismaRepository } from './infra/prisma/notification.prisma-repository';
import { PrismaService } from './infra/prisma/prisma.service';
import { ServiceModule } from './infra/services/service.module';
import { BullMqAdapter } from './infra/queue/bullmq.adapter';
import { SendNotificationWorker } from './infra/queue/workers/send-notification.worker';

@Module({
  imports: [ConfigModule, BullMqModule, ServiceModule],
  controllers: [NotificationsController],
  providers: [
    Logger,
    PrismaService,
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
