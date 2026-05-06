import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { QueueModule } from './queue/queue.module';
import { EventModule } from './event/event.module';
import { RuleService } from './rule/rule.service';
import { Module } from '@nestjs/common';
import { dbConfig } from './config/database.config';
import { DeviceModule } from './devices/device.module';
import { AlertModule } from './alert/alert.module';
import { RedisModule } from './redis/redis.module';
import { HealthModule } from './healthcheck/health.module';

const modules = [
  QueueModule,
  EventModule,
  DeviceModule,
  AlertModule,
  RedisModule,
  HealthModule,
];
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dbConfig()),
    ...modules,
  ],
  providers: [RuleService],
})
export class AppModule {}
