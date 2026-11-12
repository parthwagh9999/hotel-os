import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEmail,
  Min,
  Max,
  MinLength,
  MaxLength,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class GuestInfoDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+91-9876543210' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class CreateBookingDto {
  @ApiProperty({ example: 'hotel-uuid-here' })
  @IsString()
  hotelId: string;

  @ApiProperty({ example: 'room-uuid-here' })
  @IsString()
  roomId: string;

  @ApiProperty({ example: '2025-06-15T14:00:00Z' })
  @IsDateString()
  checkInDate: string;

  @ApiProperty({ example: '2025-06-18T11:00:00Z' })
  @IsDateString()
  checkOutDate: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  @Max(20)
  guests: number;

  @ApiPropertyOptional({ type: GuestInfoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => GuestInfoDto)
  guestInfo?: GuestInfoDto;

  @ApiPropertyOptional({ example: 'Late check-in requested' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  specialRequests?: string;

  @ApiPropertyOptional({ example: 'idempotency-key-uuid' })
  @IsOptional()
  @IsString()
  idempotencyKey?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isWalkIn?: boolean;
}
