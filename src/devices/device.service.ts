import { Injectable, BadRequestException } from '@nestjs/common';

import { DeviceRepository } from './device.repository';

import { CreateDeviceDto } from './dto/device.dto';
import { DeviceStatus } from './device.entity';

@Injectable()
export class DeviceService {
  constructor(private readonly deviceRepository: DeviceRepository) {}

  async create(dto: CreateDeviceDto) {
    const existed = await this.deviceRepository.findByName(dto.name);
    // Assuming device names must be unique, we check if a device with the same name already exists before creating a new one.
    // If it does, we throw a BadRequestException to inform the client that the device name is already taken.
    if (existed) {
      throw new BadRequestException('Device name already exists');
    }

    return this.deviceRepository.createDevice(dto);
  }

  async findAll(status?: DeviceStatus) {
    const devices = await this.deviceRepository.findAll(status);

    return {
      data: devices,
      meta: {
        total: devices.length,
      },
    };
  }
  async findById(id: string) {
    return this.deviceRepository.findById(id);
  }
}
