import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventController } from './event.controller';
import { EventProcessor } from './event.processor';

import { QueueModule } from '../queue/queue.module';
import { RuleService } from '../rule/rule.service';
import { Event } from './event.entity';
import { Alert } from 'src/alert/alert.entity';
import { Device } from 'src/devices/device.entity';
import { EventRepository } from './event.repository';
import { AlertRepository } from 'src/alert/alert.repository';
import { DeviceModule } from 'src/devices/device.module';
import { EventService } from './event.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Alert, Device]),
    QueueModule,
    DeviceModule,
  ],
  controllers: [EventController],
  providers: [
    RuleService,
    EventService,
    EventProcessor,
    EventRepository,
    AlertRepository,
    Logger,
  ],
})
export class EventModule {}
