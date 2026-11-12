import { PartialType } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateRoomDto } from './create-room.dto';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {}

export class BulkUpdateRoomStatusDto {
  @ApiProperty({ example: ['room-uuid-1', 'room-uuid-2'] })
  @IsArray()
  @IsString({ each: true })
  roomIds: string[];

  @ApiProperty({ example: 'MAINTENANCE', enum: ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'CLEANING', 'OUT_OF_ORDER'] })
  @IsEnum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'CLEANING', 'OUT_OF_ORDER'])
  status: string;

  @ApiPropertyOptional({ example: 'Scheduled maintenance' })
  @IsOptional()
  @IsString()
  reason?: string;
}
