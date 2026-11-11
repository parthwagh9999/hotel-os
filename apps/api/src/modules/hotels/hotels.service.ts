import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';

@Injectable()
export class HotelsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateHotelDto) {
    const slug =
      dto.slug ||
      dto.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

    const existing = await this.prisma.hotel.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new ConflictException('A hotel with this slug already exists');
    }

    const hotel = await this.prisma.hotel.create({
      data: {
        name: dto.name,
        slug,
        type: (dto.type as any) || 'HOTEL',
        description: dto.description,
        address: dto.address?.street || '',
        city: dto.address?.city || '',
        state: dto.address?.state || '',
        country: dto.address?.country || 'India',
        postalCode: dto.address?.zipCode || '',
        contactPhone: dto.phone || '',
        contactEmail: dto.email || '',
        website: dto.website,
        starRating: dto.starRating || 3,
        checkInTime: dto.checkInTime || '14:00',
        checkOutTime: dto.checkOutTime || '11:00',
        amenities: dto.amenities || [],
        policies: dto.policies || {},
        latitude: dto.latitude,
        longitude: dto.longitude,
        status: 'SUBMITTED',
        rank: 'BRONZE',
        totalRooms: 0,
        totalFloors: 1,
      },
    });

    // Make the creator the HOTEL_OWNER
    await this.prisma.hotelMember.create({
      data: {
        hotelId: hotel.id,
        userId,
        role: 'HOTEL_OWNER',
        permissions: { all: true },
      },
    });

    // Assign STARTER trial subscription
    await this.prisma.subscription.create({
      data: {
        hotelId: hotel.id,
        plan: 'STARTER',
        status: 'TRIAL',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30-day trial
        trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        amount: 0,
        currency: 'INR',
        maxRooms: 30,
        maxStaff: 5,
      },
    });

    return hotel;
  }

  async findAll(query: {
    city?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    starRating?: number;
    amenities?: string[];
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'APPROVED',
    };

    if (query.city) {
      where.city = { contains: query.city, mode: 'insensitive' };
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.starRating) {
      where.starRating = { gte: Number(query.starRating) };
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { city: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [hotels, total] = await Promise.all([
      this.prisma.hotel.findMany({
        where,
        skip,
        take: limit,
        include: {
          roomCategories: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              basePrice: true,
              maxOccupancy: true,
              images: true,
            },
          },
          reviews: {
            where: { status: 'APPROVED' },
            select: {
              overallRating: true,
            },
          },
        },
        orderBy: [{ isFeatured: 'desc' }, { rank: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.hotel.count({ where }),
    ]);

    // Format output with minimum room price and avg rating
    const data = hotels.map((hotel) => {
      const prices = hotel.roomCategories.map((rc) => Number(rc.basePrice));
      const minPrice = prices.length ? Math.min(...prices) : 0;
      const ratings = hotel.reviews.map((r) => r.overallRating);
      const avgRating = ratings.length
        ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
        : 4.5;

      return {
        ...hotel,
        minPrice,
        avgRating,
        totalReviews: ratings.length,
      };
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { slug },
      include: {
        roomCategories: {
          where: { isActive: true },
          include: {
            rooms: {
              select: {
                id: true,
                roomNumber: true,
                status: true,
              },
            },
          },
        },
        reviews: {
          where: { status: 'APPROVED' },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return hotel;
  }

  async findById(id: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id },
      include: {
        roomCategories: true,
        subscription: true,
      },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return hotel;
  }

  async findUserHotels(userId: string) {
    const memberships = await this.prisma.hotelMember.findMany({
      where: { userId, isActive: true },
      include: {
        hotel: {
          include: {
            subscription: true,
            _count: {
              select: {
                rooms: true,
                bookings: true,
              },
            },
          },
        },
      },
    });

    return memberships.map((m) => ({
      ...m.hotel,
      memberRole: m.role,
      permissions: m.permissions,
    }));
  }

  async update(id: string, userId: string, dto: UpdateHotelDto) {
    const membership = await this.prisma.hotelMember.findFirst({
      where: { hotelId: id, userId, isActive: true },
    });

    if (!membership && userId !== 'SYSTEM') {
      throw new ForbiddenException('Not authorized to edit this hotel');
    }

    const data: any = { ...dto };
    if (dto.address) {
      data.address = dto.address.street;
      data.city = dto.address.city;
      data.state = dto.address.state;
      data.country = dto.address.country;
      data.postalCode = dto.address.zipCode;
      delete data.address;
    }

    return this.prisma.hotel.update({
      where: { id },
      data,
    });
  }

  async getDashboardStats(hotelId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalRooms,
      availableRooms,
      occupiedRooms,
      cleaningRooms,
      maintenanceRooms,
      todayArrivals,
      todayDepartures,
      todayBookings,
      monthlyBookings,
      pendingTasks,
    ] = await Promise.all([
      this.prisma.room.count({ where: { hotelId, isActive: true } }),
      this.prisma.room.count({ where: { hotelId, status: 'AVAILABLE', isActive: true } }),
      this.prisma.room.count({ where: { hotelId, status: 'OCCUPIED', isActive: true } }),
      this.prisma.room.count({ where: { hotelId, status: 'CLEANING_REQUIRED', isActive: true } }),
      this.prisma.room.count({ where: { hotelId, status: 'MAINTENANCE', isActive: true } }),
      this.prisma.booking.count({
        where: {
          hotelId,
          checkIn: { gte: today, lt: tomorrow },
          status: { in: ['CONFIRMED', 'AWAITING_PAYMENT'] },
        },
      }),
      this.prisma.booking.count({
        where: {
          hotelId,
          checkOut: { gte: today, lt: tomorrow },
          status: 'CHECKED_IN',
        },
      }),
      this.prisma.booking.findMany({
        where: {
          hotelId,
          createdAt: { gte: today, lt: tomorrow },
          status: { notIn: ['CANCELLED'] },
        },
        select: { totalAmount: true },
      }),
      this.prisma.booking.findMany({
        where: {
          hotelId,
          createdAt: { gte: firstDayOfMonth },
          status: { notIn: ['CANCELLED'] },
        },
        select: { totalAmount: true },
      }),
      this.prisma.housekeepingTask.count({
        where: { hotelId, status: { in: ['PENDING', 'ASSIGNED', 'IN_PROGRESS'] } },
      }),
    ]);

    const todayRevenue = todayBookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);
    const monthlyRevenue = monthlyBookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);
    const occupancyRate = totalRooms > 0 ? Number(((occupiedRooms / totalRooms) * 100).toFixed(1)) : 0;
    const averageDailyRate = occupiedRooms > 0 ? Math.round(todayRevenue / occupiedRooms) : 0;
    const revenuePerAvailableRoom = totalRooms > 0 ? Math.round(todayRevenue / totalRooms) : 0;

    return {
      totalRooms,
      availableRooms,
      occupiedRooms,
      cleaningRequiredRooms: cleaningRooms,
      maintenanceRooms,
      occupancyRate,
      todayArrivals,
      todayDepartures,
      todayRevenue,
      monthlyRevenue,
      averageDailyRate,
      revenuePerAvailableRoom,
      pendingHousekeepingTasks: pendingTasks,
    };
  }
}

