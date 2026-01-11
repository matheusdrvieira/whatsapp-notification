import { Prisma, Notification as PrismaNotification } from '@prisma/client';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationStatus } from '../../domain/enums/notification-status.enum';
import { NotificationType } from '../../domain/enums/notification-type.enum';

export class NotificationMapper {
  static toPrisma(entity: Notification): Prisma.NotificationCreateInput {
    return {
      type: entity.type,
      phone: entity.phone,
      status: entity.status,
      messageId: entity.messageId,
    };
  }

  static toDomain(record: PrismaNotification): Notification {
    return Notification.create({
      id: record.id,
      type: NotificationType[record.type],
      phone: record.phone,
      status: NotificationStatus[record.status],
      messageId: record.messageId,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
