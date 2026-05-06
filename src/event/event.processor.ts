import { AlertSeverity } from 'src/alert/alert.entity';
import { CreateEventDto } from './dto/event.dto';
import { Process, Processor } from '@nestjs/bull';
import { EventRepository } from './event.repository';
import { AlertRepository } from 'src/alert/alert.repository';
import { RuleService } from 'src/rule/rule.service';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Processor('event')
export class EventProcessor {
  constructor(
    private readonly dataSource: DataSource,
    private readonly eventRepository: EventRepository,
    private readonly alertRepository: AlertRepository,
    private readonly ruleService: RuleService,
    private readonly logger: Logger,
  ) {}

  @Process('event.created')
  async handle(job: Job<CreateEventDto>) {
    this.logger.log(`Processing job ${job.id} for device ${job.data.deviceId}`);
    const payload = job.data;
    const isCritical = await this.ruleService.shouldEscalate(
      payload.deviceId,
      payload.type,
    );
    const severity = isCritical
      ? AlertSeverity.CRITICAL
      : (payload.severity ?? AlertSeverity.LOW);

    await this.dataSource.transaction(async (manager) => {
      // 1. save event
      const event = await this.eventRepository.createEvent(payload, manager);

      // 2. evaluate rule
      const isCritical = await this.ruleService.shouldEscalate(
        payload.deviceId,
        payload.type,
      );

      // 3. create alert
      await this.alertRepository.createAlert(
        {
          type: payload.type,
          message: payload.message,
          deviceId: payload.deviceId,
          eventId: event.id,
          severity,
        },
        manager,
      );
    });

    this.logger.log(
      `Alert created — device=${payload.deviceId} severity=${severity}`,
    );
  }
}
