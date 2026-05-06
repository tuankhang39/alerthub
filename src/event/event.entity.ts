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

@Entity('events')
@Index(['deviceId', 'type', 'createdAt'])
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  type!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column()
  deviceId!: string;

  @ManyToOne(() => Device, (device) => device.events, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'deviceId' })
  device!: Device;

  @CreateDateColumn()
  createdAt!: Date;
}
