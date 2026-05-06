import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { Device } from './device.entity';
import { Alert } from 'src/alert/alert.entity';
import { DeviceRepository } from './device.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Device, Event, Alert])],
  controllers: [DeviceController],
  providers: [DeviceService, DeviceRepository],
  exports: [DeviceService],
})
export class DeviceModule {}
