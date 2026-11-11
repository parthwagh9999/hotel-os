import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { CurrentUser, Public } from '../../common/decorators';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@ApiTags('Hotels')
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Search and browse hotels (Customer discovery)' })
  findAll(@Query() query: any) {
    return this.hotelsService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-hotels')
  @ApiOperation({ summary: 'Get all hotels owned or managed by current user' })
  findUserHotels(@CurrentUser('id') userId: string) {
    return this.hotelsService.findUserHotels(userId);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get hotel detail by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.hotelsService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Register a new hotel (Hotel onboarding wizard)' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateHotelDto) {
    return this.hotelsService.create(userId, dto);
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Patch(':hotelId')
  @ApiOperation({ summary: 'Update hotel profile and configuration' })
  update(
    @Param('hotelId') hotelId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateHotelDto
  ) {
    return this.hotelsService.update(hotelId, userId, dto);
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Get(':hotelId/dashboard')
  @ApiOperation({ summary: 'Get live KPI dashboard stats for hotel' })
  getDashboardStats(@Param('hotelId') hotelId: string) {
    return this.hotelsService.getDashboardStats(hotelId);
  }
}
