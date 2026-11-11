import {
  IsString,
  IsOptional,
  IsEmail,
  IsNumber,
  IsArray,
  IsEnum,
  IsUrl,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  IsLatitude,
  IsLongitude,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AddressDto {
  @ApiProperty({ example: '123 Main Street' })
  @IsString()
  @MinLength(3)
  street: string;

  @ApiProperty({ example: 'Mumbai' })
  @IsString()
  @MinLength(2)
  city: string;

  @ApiProperty({ example: 'Maharashtra' })
  @IsString()
  @MinLength(2)
  state: string;

  @ApiProperty({ example: 'India' })
  @IsString()
  @MinLength(2)
  country: string;

  @ApiProperty({ example: '400001' })
  @IsString()
  @MinLength(4)
  zipCode: string;
}

export class CreateHotelDto {
  @ApiProperty({ example: 'The Grand Palace Hotel' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ example: 'the-grand-palace-hotel' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  slug?: string;

  @ApiProperty({ example: 'A luxurious 5-star hotel in the heart of Mumbai' })
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  description: string;

  @ApiProperty({ example: 'LUXURY', enum: ['BUDGET', 'STANDARD', 'PREMIUM', 'LUXURY', 'BOUTIQUE', 'RESORT', 'HOSTEL', 'MOTEL'] })
  @IsString()
  type: string;

  @ApiProperty({ type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiPropertyOptional({ example: '+91-9876543210' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'info@grandpalace.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'https://grandpalace.com' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(7)
  starRating?: number;

  @ApiPropertyOptional({ example: '14:00' })
  @IsOptional()
  @IsString()
  checkInTime?: string;

  @ApiPropertyOptional({ example: '11:00' })
  @IsOptional()
  @IsString()
  checkOutTime?: string;

  @ApiPropertyOptional({ example: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiPropertyOptional({ example: ['https://example.com/image1.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ example: { cancellationHours: 24, taxPercentage: 18 } })
  @IsOptional()
  policies?: Record<string, any>;

  @ApiPropertyOptional({ example: 19.076 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 72.8777 })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
