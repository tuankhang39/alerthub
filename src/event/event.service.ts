import { Injectable, NotFoundException } from '@nestjs/common';
import { DeviceService } from 'src/devices/device.service';
import { CreateEventDto } from './dto/event.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class EventService {
  constructor(
    private readonly deviceService: DeviceService,
    @InjectQueue('event')
    private readonly queue: Queue,
  ) {}

  async create(dto: CreateEventDto) {
    const device = await this.deviceService.findById(dto.deviceId);

    if (!device) {
      throw new NotFoundException(`Device id ${dto.deviceId} not found`);
    }

    await this.queue.add('event.created', dto);

    return {
      status: 'accepted',
      message: 'Event queued successfully',
    };
  }
}
