import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@ApiTags('Finance & Accounting')
@Controller('hotels/:hotelId/finance')
@UseGuards(JwtAuthGuard, TenantGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Financial dashboard: Revenue, expenses, net profit, payment methods' })
  getOverview(@Param('hotelId') hotelId: string) {
    return this.financeService.getOverview(hotelId);
  }

  @Get('expenses')
  @ApiOperation({ summary: 'List hotel business expenses' })
  getExpenses(@Param('hotelId') hotelId: string) {
    return this.financeService.getExpenses(hotelId);
  }

  @Post('expenses')
  @ApiOperation({ summary: 'Record a new expense' })
  createExpense(
    @Param('hotelId') hotelId: string,
    @Body()
    body: {
      category: string;
      description: string;
      amount: number;
      vendorName?: string;
      invoiceNumber?: string;
      notes?: string;
    }
  ) {
    return this.financeService.createExpense(hotelId, body);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'List all generated invoices' })
  getInvoices(@Param('hotelId') hotelId: string) {
    return this.financeService.getInvoices(hotelId);
  }
}

