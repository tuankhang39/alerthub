import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from './dto/event.dto';
import { EventService } from './event.service';

@ApiTags('events')
@Controller({
  path: 'events',
  version: '1',
})
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiOperation({ summary: 'Ingest realtime device event (Backlog 2, 4)' })
  async create(@Body() dto: CreateEventDto) {
    return this.eventService.create(dto);
  }
}
