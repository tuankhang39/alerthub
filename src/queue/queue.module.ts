import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { getRedisConfig } from 'src/config/redis.config';

@Module({
  imports: [
    BullModule.forRoot({
      redis: getRedisConfig(),
    }),

    BullModule.registerQueue({
      name: 'event',
    }),
  ],

  exports: [BullModule],
})
export class QueueModule {}
