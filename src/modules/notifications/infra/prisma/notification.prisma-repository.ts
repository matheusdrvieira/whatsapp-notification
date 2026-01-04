import { Injectable } from '@nestjs/common';
import { AsyncMaybe } from 'src/shared/core/logic/maybe';
import { AppLogger } from '../../../../shared/logger/app-logger.service';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationStatus } from '../../domain/enums/notification-status.enum';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationMapper } from '../mappers/notification.mapper';
import { PrismaService } from './prisma.service';

@Injectable()
export class NotificationPrismaRepository implements NotificationRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
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

  async markSending(notificationId: string): Promise<Notification | null> {
    try {
      const result = await this.prisma.notification.updateMany({
        where: {
          id: notificationId,
          status: NotificationStatus.QUEUED,
        },
        data: {
          status: NotificationStatus.SENDING,
        },
      });

      if (result.count === 0) return null;

      const updated = await this.prisma.notification.findUnique({
        where: { id: notificationId },
      });

      return updated ? NotificationMapper.toDomain(updated) : null;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async markQueued(notificationId: string): AsyncMaybe<Notification> {
    try {
      const result = await this.prisma.notification.updateMany({
        where: { id: notificationId, status: NotificationStatus.SENDING },
        data: { status: NotificationStatus.QUEUED },
      });

      if (result.count === 0) return null;

      const record = await this.prisma.notification.findUnique({
        where: { id: notificationId },
      });

      return record ? NotificationMapper.toDomain(record) : null;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async markSent(notificationId: string): AsyncMaybe<Notification> {
    try {
      const result = await this.prisma.notification.updateMany({
        where: { id: notificationId, status: NotificationStatus.SENDING },
        data: { status: NotificationStatus.SENT },
      });

      if (result.count === 0) return null;

      const record = await this.prisma.notification.findUnique({
        where: { id: notificationId },
      });

      return record ? NotificationMapper.toDomain(record) : null;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async markFailed(notificationId: string): AsyncMaybe<Notification> {
    try {
      const result = await this.prisma.notification.updateMany({
        where: {
          id: notificationId,
          status: { in: [NotificationStatus.SENDING, NotificationStatus.QUEUED] },
        },
        data: { status: NotificationStatus.FAILED },
      });

      if (result.count === 0) return null;

      const record = await this.prisma.notification.findUnique({ where: { id: notificationId } });
      return record ? NotificationMapper.toDomain(record) : null;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
