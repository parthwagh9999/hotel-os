import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CurrentUser, Public } from '../../common/decorators';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@ApiTags('Reservations & Bookings')
@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Public()
  @Post('bookings')
  @ApiOperation({ summary: 'Create a new room reservation (Customer or Walk-in)' })
  create(
    @CurrentUser('id') userId: string | null,
    @Body() dto: CreateBookingDto
  ) {
    return this.bookingsService.create(userId, dto);
  }

  @Public()
  @Post('bookings/:id/pay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Simulate or complete payment for a reservation' })
  confirmPayment(
    @Param('id') id: string,
    @Body('method') method?: string,
    @Body('transactionId') transactionId?: string
  ) {
    return this.bookingsService.confirmPayment(id, method, transactionId);
  }

  @Public()
  @Get('bookings/ref/:ref')
  @ApiOperation({ summary: 'Lookup booking details by unique reference number' })
  findByRef(@Param('ref') ref: string) {
    return this.bookingsService.findByRef(ref);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/bookings')
  @ApiOperation({ summary: 'Get current customer reservation history' })
  getUserBookings(@CurrentUser('id') userId: string) {
    return this.bookingsService.getUserBookings(userId);
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Get('hotels/:hotelId/bookings')
  @ApiOperation({ summary: 'List hotel reservations with filters' })
  findAll(
    @Param('hotelId') hotelId: string,
    @Query() query: any
  ) {
    return this.bookingsService.findAll(hotelId, query);
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Get('hotels/:hotelId/front-desk')
  @ApiOperation({ summary: 'Front Desk Daily Arrivals and Departures Board' })
  getFrontDeskArrivalsAndDepartures(@Param('hotelId') hotelId: string) {
    return this.bookingsService.getFrontDeskArrivalsAndDepartures(hotelId);
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Post('bookings/:id/check-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'PMS Front-desk Check-in guest and occupy room' })
  checkIn(
    @Param('id') id: string,
    @CurrentUser('firstName') staffName: string
  ) {
    return this.bookingsService.checkIn(id, staffName || 'Receptionist');
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Post('bookings/:id/check-out')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'PMS Front-desk Check-out guest, trigger invoice & cleaning' })
  checkOut(
    @Param('id') id: string,
    @CurrentUser('firstName') staffName: string
  ) {
    return this.bookingsService.checkOut(id, staffName || 'Receptionist');
  }

  @Public()
  @Post('bookings/:id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel reservation and restore room availability' })
  cancel(
    @Param('id') id: string,
    @Body('reason') reason?: string
  ) {
    return this.bookingsService.cancel(id, reason);
  }
}

