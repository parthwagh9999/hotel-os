import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateHotelDto } from './create-hotel.dto';

export class UpdateHotelDto extends PartialType(CreateHotelDto) {}

export class UpdateHotelStatusDto {
  @ApiPropertyOptional({
    example: 'APPROVED',
    enum: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED'],
  })
  @IsEnum(['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED'])
  status: string;

  @ApiPropertyOptional({ example: 'All requirements met' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
