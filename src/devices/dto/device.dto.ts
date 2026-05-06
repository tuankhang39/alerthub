import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { DeviceStatus } from '../device.entity';

export class CreateDeviceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    enum: DeviceStatus,
  })
  @IsOptional()
  @IsEnum(DeviceStatus)
  status?: DeviceStatus;
}
