import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { calculateGSTRate } from '@hotel-os/shared';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  private generateBookingRef(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `HOS-${code}`;
  }

  async create(userId: string | null, dto: CreateBookingDto) {
    const checkIn = new Date(dto.checkInDate);
    const checkOut = new Date(dto.checkOutDate);

    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out date must be after check-in date');
    }

    const nights = Math.max(
      1,
      Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    );

    // Verify room exists and belongs to hotel
    const room = await this.prisma.room.findFirst({
      where: {
        id: dto.roomId,
        hotelId: dto.hotelId,
        isActive: true,
      },
      include: { category: true },
    });

    if (!room) {
      throw new NotFoundException('Selected room was not found in this hotel');
    }

    // Atomic overlap check: Ensure room is NOT already booked for overlapping dates
    const overlapping = await this.prisma.booking.findFirst({
      where: {
        hotelId: dto.hotelId,
        status: { in: ['CONFIRMED', 'CHECKED_IN', 'AWAITING_PAYMENT'] },
        bookingRooms: { some: { roomId: dto.roomId } },
        AND: [
          { checkIn: { lt: checkOut } },
          { checkOut: { gt: checkIn } },
        ],
      },
    });

    if (overlapping) {
      throw new ConflictException(
        'This room is already reserved for the selected dates. Please choose another room.'
      );
    }

    // Calculate pricing and taxes
    const baseRoomPrice = Number(room.category.basePrice);
    const roomSubtotal = baseRoomPrice * nights;
    const gstPercent = calculateGSTRate(baseRoomPrice);
    const taxAmount = Math.round((roomSubtotal * gstPercent) / 100);
    const totalAmount = roomSubtotal + taxAmount;

    // Idempotency check if key provided
    if (dto.idempotencyKey) {
      const existing = await this.prisma.booking.findUnique({
        where: { idempotencyKey: dto.idempotencyKey },
      });
      if (existing) return existing;
    }

    const bookingRef = this.generateBookingRef();
    const guestName = dto.guestInfo
      ? `${dto.guestInfo.firstName} ${dto.guestInfo.lastName}`.trim()
      : 'Guest';
    const guestEmail = dto.guestInfo?.email || 'guest@example.com';
    const guestPhone = dto.guestInfo?.phone || '';

    // Execute atomic creation in transaction
    const booking = await this.prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          bookingRef,
          hotelId: dto.hotelId,
          userId: userId || null,
          guestName,
          guestEmail,
          guestPhone,
          checkIn,
          checkOut,
          adults: dto.guests || 1,
          children: 0,
          totalAmount,
          taxAmount,
          discountAmount: 0,
          paidAmount: dto.isWalkIn ? totalAmount : 0,
          status: dto.isWalkIn ? 'CONFIRMED' : 'AWAITING_PAYMENT',
          source: dto.isWalkIn ? 'WALK_IN' : 'WEBSITE',
          specialRequests: dto.specialRequests,
          idempotencyKey: dto.idempotencyKey || null,
        },
      });

      await tx.bookingRoom.create({
        data: {
          bookingId: newBooking.id,
          roomId: room.id,
          pricePerNight: baseRoomPrice,
        },
      });

      // If walk-in, immediately create payment and mark room as OCCUPIED
      if (dto.isWalkIn) {
        await tx.payment.create({
          data: {
            bookingId: newBooking.id,
            hotelId: dto.hotelId,
            amount: totalAmount,
            currency: 'INR',
            method: 'CASH',
            status: 'COMPLETED',
          },
        });

        await tx.room.update({
          where: { id: room.id },
          data: { status: 'OCCUPIED' },
        });
      }

      return newBooking;
    });

    return this.findById(booking.id);
  }

  async confirmPayment(bookingId: string, paymentMethod: string = 'CARD', transactionId?: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { bookingRooms: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          bookingId: booking.id,
          hotelId: booking.hotelId,
          amount: booking.totalAmount,
          currency: 'INR',
          method: (paymentMethod as any) || 'CARD',
          status: 'COMPLETED',
          transactionId: transactionId || `TXN-${Date.now()}`,
        },
      });

      const updated = await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: 'CONFIRMED',
          paidAmount: booking.totalAmount,
        },
      });

      // Update room status to RESERVED if arrival is soon
      for (const br of booking.bookingRooms) {
        await tx.room.update({
          where: { id: br.roomId },
          data: { status: 'RESERVED' },
        });
      }

      return updated;
    });
  }

  async checkIn(bookingId: string, staffName: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { bookingRooms: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status === 'CHECKED_IN') {
      throw new BadRequestException('Guest is already checked in');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CHECKED_IN',
          checkedInAt: new Date(),
          checkedInBy: staffName,
        },
      });

      // Update rooms to OCCUPIED
      for (const br of booking.bookingRooms) {
        await tx.room.update({
          where: { id: br.roomId },
          data: { status: 'OCCUPIED' },
        });
      }

      return updated;
    });
  }

  async checkOut(bookingId: string, staffName: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { bookingRooms: { include: { room: true } } },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CHECKED_OUT',
          checkedOutAt: new Date(),
          checkedOutBy: staffName,
        },
      });

      // Update rooms to CLEANING_REQUIRED and auto-create housekeeping tasks
      for (const br of booking.bookingRooms) {
        await tx.room.update({
          where: { id: br.roomId },
          data: { status: 'CLEANING_REQUIRED' },
        });

        await tx.housekeepingTask.create({
          data: {
            hotelId: booking.hotelId,
            roomId: br.roomId,
            status: 'PENDING',
            priority: 'HIGH',
            type: 'CHECKOUT_CLEAN',
            checklist: [
              { item: 'Strip and replace all bed linens', completed: false },
              { item: 'Deep sanitize bathroom, toilet, shower', completed: false },
              { item: 'Inspect for guest lost-and-found items', completed: false },
              { item: 'Disinfect high-touch surfaces, remotes, switches', completed: false },
              { item: 'Restock amenities, water bottles, toiletries', completed: false },
              { item: 'Vacuum carpets and mop floors', completed: false },
            ],
            notes: `Checkout clean after guest ${booking.guestName} (Room ${br.room.roomNumber})`,
          },
        });
      }

      // Generate Invoice
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      await tx.invoice.create({
        data: {
          invoiceNumber,
          hotelId: booking.hotelId,
          bookingId: booking.id,
          userId: booking.userId,
          type: 'BOOKING',
          subtotal: Number(booking.totalAmount) - Number(booking.taxAmount),
          taxAmount: booking.taxAmount,
          totalAmount: booking.totalAmount,
          status: 'PAID',
          paidAt: new Date(),
          items: [
            {
              description: `Accommodation (${booking.bookingRef})`,
              amount: Number(booking.totalAmount),
            },
          ],
        },
      });

      // Award loyalty points to user if registered
      if (booking.userId) {
        const pointsEarned = Math.floor(Number(booking.totalAmount) / 10);
        await tx.loyaltyAccount.updateMany({
          where: { userId: booking.userId },
          data: {
            availablePoints: { increment: pointsEarned },
            lifetimePoints: { increment: pointsEarned },
            totalPoints: { increment: pointsEarned },
          },
        });
      }

      return updated;
    });
  }

  async cancel(bookingId: string, reason?: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { bookingRooms: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status === 'CHECKED_IN' || booking.status === 'CHECKED_OUT') {
      throw new BadRequestException('Cannot cancel an active or completed stay');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancellationReason: reason || 'Cancelled by guest',
        },
      });

      // Free rooms back to AVAILABLE
      for (const br of booking.bookingRooms) {
        await tx.room.update({
          where: { id: br.roomId },
          data: { status: 'AVAILABLE' },
        });
      }

      return updated;
    });
  }

  async findByRef(ref: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { bookingRef: ref },
      include: {
        hotel: true,
        bookingRooms: {
          include: {
            room: {
              include: { category: true },
            },
          },
        },
        payments: true,
        invoices: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking reference not found');
    }

    return booking;
  }

  async findById(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        hotel: true,
        bookingRooms: {
          include: {
            room: {
              include: { category: true },
            },
          },
        },
        payments: true,
        invoices: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async findAll(
    hotelId: string,
    query?: {
      status?: string;
      search?: string;
      page?: number;
      limit?: number;
    }
  ) {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = { hotelId };

    if (query?.status) where.status = query.status;
    if (query?.search) {
      where.OR = [
        { bookingRef: { contains: query.search, mode: 'insensitive' } },
        { guestName: { contains: query.search, mode: 'insensitive' } },
        { guestPhone: { contains: query.search } },
      ];
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: {
          bookingRooms: {
            include: {
              room: {
                select: {
                  roomNumber: true,
                  category: { select: { name: true } },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            starRating: true,
          },
        },
        bookingRooms: {
          include: {
            room: {
              select: {
                roomNumber: true,
                category: { select: { name: true, images: true } },
              },
            },
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFrontDeskArrivalsAndDepartures(hotelId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [arrivals, departures, inHouse] = await Promise.all([
      this.prisma.booking.findMany({
        where: {
          hotelId,
          checkIn: { gte: today, lt: tomorrow },
          status: { in: ['CONFIRMED', 'AWAITING_PAYMENT'] },
        },
        include: {
          bookingRooms: {
            include: { room: true },
          },
        },
      }),
      this.prisma.booking.findMany({
        where: {
          hotelId,
          checkOut: { gte: today, lt: tomorrow },
          status: 'CHECKED_IN',
        },
        include: {
          bookingRooms: {
            include: { room: true },
          },
        },
      }),
      this.prisma.booking.findMany({
        where: {
          hotelId,
          status: 'CHECKED_IN',
        },
        include: {
          bookingRooms: {
            include: { room: true },
          },
        },
      }),
    ]);

    return {
      arrivals,
      departures,
      inHouse,
    };
  }
}
