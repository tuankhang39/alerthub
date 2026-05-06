import Redis from 'ioredis';
import { getRedisConfig } from 'src/config/redis.config';

export const RedisProvider = {
  provide: 'REDIS_CLIENT',

  useFactory: () => {
    return new Redis(getRedisConfig());
  },
};
