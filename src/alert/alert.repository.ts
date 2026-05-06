import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EntityManager, Repository } from 'typeorm';

import { Alert, AlertSeverity } from './alert.entity';
import { QueryAlertDto } from './alert.dto.ts/alert.dto';

@Injectable()
export class AlertRepository {
  constructor(
    @InjectRepository(Alert)
    private readonly repo: Repository<Alert>,
  ) {}

  async findAll(query: QueryAlertDto) {
    const { deviceId, severity, from, to, search, page, limit } = query;

    const qb = this.repo
      .createQueryBuilder('alert')
      .leftJoinAndSelect('alert.device', 'device');

    if (deviceId) {
      qb.andWhere('alert.deviceId = :deviceId', {
        deviceId,
      });
    }

    if (severity) {
      qb.andWhere('alert.severity = :severity', {
        severity,
      });
    }

    if (from) {
      qb.andWhere('alert.createdAt >= :from', {
        from,
      });
    }

    if (to) {
      qb.andWhere('alert.createdAt <= :to', {
        to,
      });
    }

    if (search) {
      qb.andWhere(
        `
        (
            to_tsvector('english', alert.message)
            @@ plainto_tsquery('english', :search)
            OR device.name ILIKE :likeSearch
            OR CAST(device.id AS TEXT) ILIKE :likeSearch
            OR alert.message ILIKE :likeSearch
        )`,
        {
          search,
          likeSearch: `%${search}%`,
        },
      );
    }

    qb.orderBy('alert.createdAt', 'DESC');

    qb.skip((page - 1) * limit);
    qb.take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
      },
    };
  }
  async createAlert(
    payload: {
      type: string;
      message: string;
      deviceId: string;
      eventId: string;
      severity: AlertSeverity;
    },
    manager?: EntityManager,
  ) {
    const repo = manager ? manager.getRepository(Alert) : this.repo;
    const alert = repo.create(payload);
    return repo.save(alert);
  }
}
