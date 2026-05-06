import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { AlertSeverity } from 'src/alert/alert.entity';

export class CreateEventDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  deviceId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiProperty({
    enum: AlertSeverity,
    enumName: 'AlertSeverity',
    required: false,
    default: AlertSeverity.LOW,
  })
  @IsEnum(AlertSeverity)
  @IsOptional()
  severity?: AlertSeverity;
}
