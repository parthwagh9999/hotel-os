import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators';

@ApiTags('Super Admin Operations')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'PLATFORM_ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Platform-wide executive metrics' })
  getPlatformStats() {
    return this.adminService.getPlatformStats();
  }

  @Get('hotels')
  @ApiOperation({ summary: 'List all hotels on the platform' })
  getAllHotels(@Query() query: any) {
    return this.adminService.getAllHotels(query);
  }

  @Patch('hotels/:id/status')
  @ApiOperation({ summary: 'Approve, Reject, or Suspend a hotel' })
  updateHotelStatus(
    @Param('id') id: string,
    @Body('status') status: 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'UNDER_REVIEW',
    @Body('notes') notes?: string
  ) {
    return this.adminService.updateHotelStatus(id, status, notes);
  }

  @Get('users')
  @ApiOperation({ summary: 'List all platform users' })
  getAllUsers(@Query() query: any) {
    return this.adminService.getAllUsers(query);
  }

  @Patch('users/:id/toggle-active')
  @ApiOperation({ summary: 'Activate or deactivate a user account' })
  toggleUserActive(@Param('id') id: string) {
    return this.adminService.toggleUserActive(id);
  }
}
