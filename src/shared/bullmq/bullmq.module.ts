import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { BullMqService } from './bullmq.service';

@Module({
  imports: [RedisModule],
  providers: [BullMqService],
  exports: [BullMqService],
})
export class BullMqModule {}
