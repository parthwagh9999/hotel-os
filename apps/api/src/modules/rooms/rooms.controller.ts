import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Public } from '../../common/decorators';

@ApiTags('Rooms & Inventory')
@Controller('hotels/:hotelId')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  // ─── Categories ────────────────────────────────────────────────────────────

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'List room categories for a hotel' })
  findCategories(@Param('hotelId') hotelId: string) {
    return this.roomsService.findCategories(hotelId);
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Post('categories')
  @ApiOperation({ summary: 'Create a new room category' })
  createCategory(
    @Param('hotelId') hotelId: string,
    @Body() dto: CreateCategoryDto
  ) {
    return this.roomsService.createCategory(hotelId, dto);
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Patch('categories/:id')
  @ApiOperation({ summary: 'Update a room category' })
  updateCategory(
    @Param('hotelId') hotelId: string,
    @Param('id') id: string,
    @Body() dto: Partial<CreateCategoryDto>
  ) {
    return this.roomsService.updateCategory(id, hotelId, dto);
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete a room category' })
  deleteCategory(
    @Param('hotelId') hotelId: string,
    @Param('id') id: string
  ) {
    return this.roomsService.deleteCategory(id, hotelId);
  }

  // ─── Rooms ─────────────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Get('rooms')
  @ApiOperation({ summary: 'List all rooms in hotel with status and category' })
  findRooms(
    @Param('hotelId') hotelId: string,
    @Query() query: any
  ) {
    return this.roomsService.findRooms(hotelId, query);
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Post('rooms')
  @ApiOperation({ summary: 'Add a new room to inventory' })
  createRoom(
    @Param('hotelId') hotelId: string,
    @Body() dto: CreateRoomDto
  ) {
    return this.roomsService.createRoom(hotelId, dto);
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Patch('rooms/:id')
  @ApiOperation({ summary: 'Update room details' })
  updateRoom(
    @Param('hotelId') hotelId: string,
    @Param('id') id: string,
    @Body() dto: UpdateRoomDto
  ) {
    return this.roomsService.updateRoom(id, hotelId, dto);
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Patch('rooms/:id/status')
  @ApiOperation({ summary: 'Update room status (Available, Occupied, Cleaning, Maintenance)' })
  updateStatus(
    @Param('hotelId') hotelId: string,
    @Param('id') id: string,
    @Body('status') status: string
  ) {
    return this.roomsService.updateStatus(id, hotelId, status);
  }

  // ─── Public Availability Search ────────────────────────────────────────────

  @Public()
  @Get('availability')
  @ApiOperation({ summary: 'Check real-time room availability for booking dates' })
  checkAvailability(
    @Param('hotelId') hotelId: string,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
    @Query('guests') guests?: number
  ) {
    return this.roomsService.checkAvailability(
      hotelId,
      checkIn,
      checkOut,
      guests ? Number(guests) : 1
    );
  }
}

