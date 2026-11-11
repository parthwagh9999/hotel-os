import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async getOverview(hotelId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      allPayments,
      todayPayments,
      monthPayments,
      allExpenses,
      invoices,
    ] = await Promise.all([
      this.prisma.payment.findMany({
        where: { hotelId, status: 'COMPLETED' },
      }),
      this.prisma.payment.findMany({
        where: { hotelId, status: 'COMPLETED', createdAt: { gte: today } },
      }),
      this.prisma.payment.findMany({
        where: { hotelId, status: 'COMPLETED', createdAt: { gte: firstDayOfMonth } },
      }),
      this.prisma.expense.findMany({
        where: { hotelId },
      }),
      this.prisma.invoice.findMany({
        where: { hotelId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);

    const totalRevenue = allPayments.reduce((acc, p) => acc + Number(p.amount), 0);
    const todayRevenue = todayPayments.reduce((acc, p) => acc + Number(p.amount), 0);
    const monthlyRevenue = monthPayments.reduce((acc, p) => acc + Number(p.amount), 0);
    const totalExpenses = allExpenses.reduce((acc, e) => acc + Number(e.amount), 0);
    const netProfit = totalRevenue - totalExpenses;

    // Payment method breakdown
    const methods: Record<string, number> = {};
    for (const p of allPayments) {
      methods[p.method] = (methods[p.method] || 0) + Number(p.amount);
    }

    return {
      totalRevenue,
      todayRevenue,
      monthlyRevenue,
      totalExpenses,
      netProfit,
      paymentMethodBreakdown: methods,
      recentInvoices: invoices,
    };
  }

  async getExpenses(hotelId: string) {
    return this.prisma.expense.findMany({
      where: { hotelId },
      orderBy: { date: 'desc' },
    });
  }

  async createExpense(
    hotelId: string,
    data: {
      category: string;
      description: string;
      amount: number;
      vendorName?: string;
      invoiceNumber?: string;
      notes?: string;
    }
  ) {
    return this.prisma.expense.create({
      data: {
        hotelId,
        category: data.category,
        description: data.description,
        amount: data.amount,
        date: new Date(),
        vendorName: data.vendorName,
        invoiceNumber: data.invoiceNumber,
        notes: data.notes,
      },
    });
  }

  async getInvoices(hotelId: string) {
    return this.prisma.invoice.findMany({
      where: { hotelId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

