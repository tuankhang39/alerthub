import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { Alert } from './alert.entity';
import { AlertRepository } from './alert.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Alert])],
  controllers: [AlertController],
  providers: [AlertService, AlertRepository],
  exports: [AlertService],
})
export class AlertModule {}
