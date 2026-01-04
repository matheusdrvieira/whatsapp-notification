import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisPort } from './redis.port';
import { RedisService } from './redis.service';

@Module({
  imports: [ConfigModule],
  providers: [
    RedisService,
    {
      provide: RedisPort,
      useExisting: RedisService,
    },
  ],
  exports: [RedisService, RedisPort],
})
export class RedisModule {}
