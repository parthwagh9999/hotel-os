import { IsEnum, IsOptional, IsString, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBookingStatusDto {
  @ApiProperty({
    example: 'CONFIRMED',
    enum: ['AWAITING_PAYMENT', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW', 'REFUNDED'],
  })
  @IsEnum([
    'AWAITING_PAYMENT',
    'CONFIRMED',
    'CHECKED_IN',
    'CHECKED_OUT',
    'CANCELLED',
    'NO_SHOW',
    'REFUNDED',
  ])
  status: string;

  @ApiPropertyOptional({ example: 'Guest requested cancellation' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

export class CancelBookingDto {
  @ApiPropertyOptional({ example: 'Change of plans' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

export class CheckInDto {
  @ApiPropertyOptional({ example: 'ID verified - Passport #AB12345' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiPropertyOptional({ example: 'AB12345' })
  @IsOptional()
  @IsString()
  idDocument?: string;
}

export class CheckOutDto {
  @ApiPropertyOptional({ example: 'Mini-bar charges applied' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class LookupBookingDto {
  @ApiProperty({ example: 'HOS-A1B2C3' })
  @IsString()
  bookingRef: string;

  @ApiProperty({ example: 'guest@example.com' })
  @IsString()
  email: string;
}
