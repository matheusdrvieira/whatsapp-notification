import { Injectable } from '@nestjs/common';
import { AsyncMaybe } from 'src/shared/core/logic/maybe';
import { Logger } from '../../../../shared/logger/logger.service';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationStatus } from '../../domain/enums/notification-status.enum';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationMapper } from '../mappers/notification.mapper';
import { PrismaService } from './prisma.service';

@Injectable()
export class NotificationPrismaRepository implements NotificationRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) { }

  async findById(id: string): Promise<Notification | null> {
    try {
      const record = await this.prisma.notification.findUnique({ where: { id } });
      return record ? NotificationMapper.toDomain(record) : null;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async findByMessageId(messageId: string): AsyncMaybe<Notification> {
    try {
      const record = await this.prisma.notification.findFirst({ where: { messageId } });
      return record ? NotificationMapper.toDomain(record) : null;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async create(notification: Notification): Promise<Notification> {
    try {
      const created = await this.prisma.notification.create({
        data: NotificationMapper.toPrisma(notification),
      });

      return NotificationMapper.toDomain(created);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async markSending(notificationId: string): AsyncMaybe<void> {
    try {
      await this.prisma.notification.updateMany({
        where: {
          id: notificationId,
        },
        data: {
          status: NotificationStatus.SENDING,
        },
      });
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async markSent(notificationId: string): AsyncMaybe<void> {
    try {
      await this.prisma.notification.updateMany({
        where: {
          id: notificationId
        },
        data: { status: NotificationStatus.SENT },
      });
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async markFailed(notificationId: string): AsyncMaybe<void> {
    try {
      await this.prisma.notification.updateMany({
        where: {
          id: notificationId,
        },
        data: { status: NotificationStatus.FAILED },
      });
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async findFailed(): Promise<Notification[]> {
    try {
      const records = await this.prisma.notification.findMany({
        where: {
          status: NotificationStatus.FAILED,
        },
      });

      return records.map(NotificationMapper.toDomain);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
