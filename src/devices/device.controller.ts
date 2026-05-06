import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/device.dto';
import { DeviceStatus } from './device.entity';

@ApiTags('devices')
@Controller({
  path: 'devices',
  version: '1',
})
export class DeviceController {
  constructor(private service: DeviceService) {}
  @Post()
  @ApiOperation({ summary: 'Create new device (Backlog 1)' })
  create(@Body() dto: CreateDeviceDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get devices with optional status filter (Backlog 1)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: DeviceStatus,
    description: 'Optional device status filter',
    example: DeviceStatus.ACTIVE,
  })
  findAll(@Query('status') status?: DeviceStatus) {
    return this.service.findAll(status);
  }
}
