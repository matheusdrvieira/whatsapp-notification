import { Prisma, Notification as PrismaNotification } from '@prisma/client';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationStatus } from '../../domain/enums/notification-status.enum';

export class NotificationMapper {
  static toPrisma(entity: Notification): Prisma.NotificationCreateInput {
    return {
      to: entity.to,
      message: entity.message,
      status: entity.status,
    };
  }

  static toDomain(record: PrismaNotification): Notification {
    return Notification.create({
      id: record.id,
      to: record.to,
      message: record.message,
      status: record.status as NotificationStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
