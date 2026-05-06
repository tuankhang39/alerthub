import { Body, Controller, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from './dto/event.dto';

@ApiTags('events')
@Controller({
  path: 'events',
  version: '1',
})
export class EventController {
  constructor(
    @InjectQueue('event')
    private readonly queue: Queue,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Ingest realtime device event' })
  async create(@Body() dto: CreateEventDto) {
    await this.queue.add('event.created', dto);

    return {
      status: 'accepted',
      message: 'Event queued successfully',
    };
  }
}
