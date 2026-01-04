import { Injectable, OnModuleDestroy } from '@nestjs/common';
import type {
  ConnectionOptions,
  Processor,
  QueueOptions,
  WorkerOptions,
} from 'bullmq';
import { Queue, Worker } from 'bullmq';
import { RedisService } from '../redis/redis.service';

type Closable = { close(): Promise<void> };

@Injectable()
export class BullMqService implements OnModuleDestroy {
  private readonly connection: ConnectionOptions;
  private readonly queues = new Map<string, Queue<any>>();
  private readonly workers: Closable[] = [];

  constructor(redis: RedisService) {
    this.connection = redis.getBullMqConnection();
  }

  getQueue<Data = any>(
    name: string,
    options?: Omit<QueueOptions, 'connection'>,
  ): Queue<Data> {
    const existing = this.queues.get(name);

    if (existing) return existing as Queue<Data>;

    const queue = new Queue(name, {
      connection: this.connection,
      ...(options ?? {}),
    });

    this.queues.set(name, queue);

    return queue as Queue<Data>;
  }

  createWorker<Data = any>(
    name: string,
    processor: Processor<Data>,
    options?: Omit<WorkerOptions, 'connection'>,
  ): Worker<Data> {
    const worker = new Worker<Data>(name, processor, {
      connection: this.connection,
      ...(options ?? {}),
    });

    this.workers.push(worker);
    return worker;
  }

  async onModuleDestroy(): Promise<void> {
    const workers = [...this.workers];
    const queues = Array.from(this.queues.values());

    await Promise.allSettled(workers.map((worker) => worker.close()));
    await Promise.allSettled(queues.map((queue) => queue.close()));
  }
}
