import { Device } from '../devices/device.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('alerts')
@Index(['deviceId', 'createdAt'])
@Index(['severity'])
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  type!: string;

  @Column({
    type: 'enum',
    enum: AlertSeverity,
    default: AlertSeverity.LOW,
  })
  severity!: AlertSeverity;

  @Column({ type: 'text' })
  message!: string;

  @Column()
  deviceId!: string;

  @ManyToOne(() => Device, (device) => device.alerts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'deviceId' })
  device!: Device;

  @Column({ nullable: true })
  eventId?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
