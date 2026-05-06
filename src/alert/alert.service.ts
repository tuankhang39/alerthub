import { Injectable } from '@nestjs/common';

import { AlertRepository } from './alert.repository';
import { QueryAlertDto } from './alert.dto.ts/alert.dto';

@Injectable()
export class AlertService {
  constructor(private readonly alertRepository: AlertRepository) {}

  async findAll(query: QueryAlertDto) {
    return this.alertRepository.findAll(query);
  }
}
