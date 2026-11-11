import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HousekeepingService } from './housekeeping.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentUser } from '../../common/decorators';

@ApiTags('Housekeeping Operations')
@Controller('hotels/:hotelId/housekeeping')
@UseGuards(JwtAuthGuard, TenantGuard)
export class HousekeepingController {
  constructor(private readonly housekeepingService: HousekeepingService) {}

  @Get('tasks')
  @ApiOperation({ summary: 'List housekeeping tasks for hotel' })
  findTasks(
    @Param('hotelId') hotelId: string,
    @Query('status') status?: string
  ) {
    return this.housekeepingService.findTasks(hotelId, status);
  }

  @Post('tasks')
  @ApiOperation({ summary: 'Create new cleaning task' })
  createTask(
    @Param('hotelId') hotelId: string,
    @Body()
    body: {
      roomId: string;
      assignedTo?: string;
      priority?: string;
      type?: string;
      notes?: string;
    }
  ) {
    return this.housekeepingService.createTask(hotelId, body);
  }

  @Patch('tasks/:id/status')
  @ApiOperation({ summary: 'Update cleaning progress (Assigned -> In Progress -> Completed -> Inspected)' })
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @CurrentUser('firstName') inspectorName: string
  ) {
    return this.housekeepingService.updateTaskStatus(id, status, inspectorName);
  }

  @Patch('tasks/:id/checklist')
  @ApiOperation({ summary: 'Update cleaning checklist items' })
  updateChecklist(
    @Param('id') id: string,
    @Body('checklist') checklist: Array<{ item: string; completed: boolean }>
  ) {
    return this.housekeepingService.updateChecklist(id, checklist);
  }
}
