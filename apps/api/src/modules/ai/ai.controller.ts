import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@ApiTags('AI & Predictive Analytics')
@Controller('hotels/:hotelId/ai')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('occupancy-forecast')
  @ApiOperation({ summary: 'Predict daily occupancy rates with confidence intervals' })
  getOccupancyForecast(
    @Param('hotelId') hotelId: string,
    @Query('days') days?: number
  ) {
    return this.aiService.getOccupancyForecast(hotelId, days ? Number(days) : 14);
  }

  @Get('pricing-recommendations')
  @ApiOperation({ summary: 'AI Revenue Manager dynamic pricing suggestions' })
  getDynamicPricingRecommendations(@Param('hotelId') hotelId: string) {
    return this.aiService.getDynamicPricingRecommendations(hotelId);
  }

  @Get('cancellation-risk')
  @ApiOperation({ summary: 'Evaluate cancellation probability on upcoming reservations' })
  getCancellationRiskAnalysis(@Param('hotelId') hotelId: string) {
    return this.aiService.getCancellationRiskAnalysis(hotelId);
  }
}
