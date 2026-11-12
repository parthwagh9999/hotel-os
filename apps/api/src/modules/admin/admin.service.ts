import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getPlatformStats() {
    const [
      totalHotels,
      approvedHotels,
      pendingHotels,
      totalUsers,
      totalBookings,
      allPayments,
      activeSubscriptions,
    ] = await Promise.all([
      this.prisma.hotel.count(),
      this.prisma.hotel.count({ where: { status: 'APPROVED' } }),
      this.prisma.hotel.count({ where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } } }),
      this.prisma.user.count(),
      this.prisma.booking.count(),
      this.prisma.payment.findMany({
        where: { status: 'COMPLETED' },
        select: { amount: true },
      }),
      this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    ]);

    const totalRevenue = allPayments.reduce((acc, p) => acc + Number(p.amount), 0);
    const platformCommissions = Math.round(totalRevenue * 0.1); // 10% platform take rate

    return {
      totalHotels,
      approvedHotels,
      pendingHotels,
      totalUsers,
      totalBookings,
      totalRevenue,
      platformCommissions,
      activeSubscriptions,
    };
  }

  async getAllHotels(query?: { status?: string; search?: string; page?: number; limit?: number }) {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query?.status) where.status = query.status;
    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { city: { contains: query.search, mode: 'insensitive' } },
        { contactEmail: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [hotels, total] = await Promise.all([
      this.prisma.hotel.findMany({
        where,
        skip,
        take: limit,
        include: {
          subscription: true,
          _count: {
            select: {
              rooms: true,
              bookings: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.hotel.count({ where }),
    ]);

    return {
      data: hotels,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateHotelStatus(
    hotelId: string,
    status: 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'UNDER_REVIEW',
    notes?: string
  ) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return this.prisma.hotel.update({
      where: { id: hotelId },
      data: {
        status,
        isVerified: status === 'APPROVED',
        ...(notes
          ? {
              metadata: {
                ...((hotel.metadata as Record<string, any>) || {}),
                reviewNotes: notes,
                reviewedAt: new Date().toISOString(),
              },
            }
          : {}),
      },
    });
  }

  async getAllUsers(query?: { role?: string; search?: string; page?: number; limit?: number }) {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query?.role) where.role = query.role;
    if (query?.search) {
      where.OR = [
        { email: { contains: query.search, mode: 'insensitive' } },
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          isEmailVerified: true,
          lastLoginAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async toggleUserActive(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });
  }
}

