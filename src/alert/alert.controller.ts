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
    summary: 'Get alerts with filters',
  })
  findAll(@Query() query: QueryAlertDto) {
    return this.service.findAll(query);
  }
}
