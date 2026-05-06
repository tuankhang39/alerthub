import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RuleService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  async shouldEscalate(deviceId: string, type: string): Promise<boolean> {
    const key = `rule:${deviceId}:${type}`;
    const now = Date.now();
    const windowStart = now - 60_000;

    const pipeline = this.redis.pipeline();
    pipeline.zadd(key, now, `${now}-${Math.random()}`);
    pipeline.zremrangebyscore(key, '-inf', windowStart);
    pipeline.expire(key, 60);
    pipeline.zcard(key);

    const results = await pipeline.exec();
    if (!results) return false;
    // results[0] → zadd, results[1] → zremrangebyscore, results[2] → expire, results[3] → zcard
    const ZCARD_INDEX = 3;
    const [, eventCount] = results[ZCARD_INDEX];

    return ((eventCount as number) ?? 0) > 5;
  }
}
