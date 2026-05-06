import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryAlertDto } from './alert.dto.ts/alert.dto';
import { AlertService } from './alert.service';

@ApiTags('alerts')
@Controller({
  path: 'alerts',
  version: '1',
})
export class AlertController {
  constructor(private readonly service: AlertService) {}

  @Get()
  @ApiOperation({
    summary:
      'Get alerts with filters (Backlog 3, 5) - Use "search" parameters to filter by device name, message content, or device ID',
  })
  findAll(@Query() query: QueryAlertDto) {
    return this.service.findAll(query);
  }
}
