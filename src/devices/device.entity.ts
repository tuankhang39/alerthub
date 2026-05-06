import { Alert } from '../alert/alert.entity';
import { Event } from '../event/event.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

export enum DeviceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
}

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column()
  name!: string;

  @Index()
  @Column({
    type: 'enum',
    enum: DeviceStatus,
    default: DeviceStatus.ACTIVE,
  })
  status!: DeviceStatus;

  @OneToMany(() => Alert, (alert) => alert.device)
  alerts!: Alert[];

  @OneToMany(() => Event, (event) => event.device)
  events!: Event[];

  @CreateDateColumn()
  createdAt!: Date;
}
