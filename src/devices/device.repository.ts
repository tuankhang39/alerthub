import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Device, DeviceStatus } from './device.entity';

@Injectable()
export class DeviceRepository {
  constructor(
    @InjectRepository(Device)
    private readonly repo: Repository<Device>,
  ) {}

  async findByName(name: string) {
    return this.repo.findOne({
      where: { name },
    });
  }

  async createDevice(payload: Partial<Device>) {
    const device = this.repo.create(payload);
    return this.repo.save(device);
  }

  async findAll(status?: DeviceStatus) {
    const qb = this.repo.createQueryBuilder('device');

    if (status) {
      qb.andWhere('device.status = :status', {
        status,
      });
    }

    qb.orderBy('device.createdAt', 'DESC');

    return qb.getMany();
  }
}
