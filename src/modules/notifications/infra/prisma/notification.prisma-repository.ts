import { Injectable } from '@nestjs/common';
import { AsyncMaybe } from 'src/shared/core/logic/maybe';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationStatus } from '../../domain/enums/notification-status.enum';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationMapper } from '../mappers/notification.mapper';
import { PrismaService } from './prisma.service';

@Injectable()
export class NotificationPrismaRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findById(id: string): Promise<Notification | null> {
    const record = await this.prisma.notification.findUnique({ where: { id } });
    return record ? NotificationMapper.toDomain(record) : null;
  }

  async create(notification: Notification): Promise<Notification> {
    const created = await this.prisma.notification.create({
      data: NotificationMapper.toPrisma(notification),
    });

    return NotificationMapper.toDomain(created);
  }

  async markSending(notificationId: string): Promise<Notification | null> {
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
  }

  async markQueued(notificationId: string): AsyncMaybe<Notification> {
    const result = await this.prisma.notification.updateMany({
      where: { id: notificationId, status: NotificationStatus.SENDING },
      data: { status: NotificationStatus.QUEUED },
    });

    if (result.count === 0) return null;

    const record = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    return record ? NotificationMapper.toDomain(record) : null;
  }

  async markSent(notificationId: string): AsyncMaybe<Notification> {
    const result = await this.prisma.notification.updateMany({
      where: { id: notificationId, status: NotificationStatus.SENDING },
      data: { status: NotificationStatus.SENT },
    });

    if (result.count === 0) return null;

    const record = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    return record ? NotificationMapper.toDomain(record) : null;
  }

  async markFailed(notificationId: string): AsyncMaybe<Notification> {
    const result = await this.prisma.notification.updateMany({
      where: { id: notificationId, status: NotificationStatus.SENDING },
      data: { status: NotificationStatus.FAILED },
    });

    if (result.count === 0) return null;

    const record = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    return record ? NotificationMapper.toDomain(record) : null;
  }
}
