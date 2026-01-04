import { Injectable, OnModuleDestroy } from '@nestjs/common';
import type { ConnectionOptions } from 'bullmq';
import IORedis from 'ioredis';
import { env } from 'src/config/env';
import { AppLogger } from '../logger/app-logger.service';
import { RedisPort } from './redis.port';

@Injectable()
export class RedisService extends RedisPort implements OnModuleDestroy {
  private readonly client: IORedis;

  constructor(private readonly logger: AppLogger) {
    super();
    this.logger.setContext(RedisService.name);
    this.client = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null });
  }

  getBullMqConnection(): ConnectionOptions {
    return { url: env.REDIS_URL, maxRetriesPerRequest: null };
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl && ttl > 0) {
      await this.client.set(key, value, 'EX', ttl);
      return;
    }

    await this.client.set(key, value);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.client.quit();
    } catch (err) {
      this.logger.error(err);
      this.client.disconnect();
    }
  }
}
