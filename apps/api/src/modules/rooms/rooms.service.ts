import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  // ─── Room Categories ───────────────────────────────────────────────────────

  async createCategory(hotelId: string, dto: CreateCategoryDto) {
    const slug =
      dto.slug ||
      dto.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const existing = await this.prisma.roomCategory.findUnique({
      where: {
        hotelId_slug: { hotelId, slug },
      },
    });

    if (existing) {
      throw new ConflictException('A room category with this name already exists');
    }

    return this.prisma.roomCategory.create({
      data: {
        hotelId,
        name: dto.name,
        slug,
        description: dto.description,
        basePrice: dto.basePrice,
        maxOccupancy: dto.maxOccupancy || 2,
        extraPersonCharge: dto.extraPersonCharge || 500,
        amenities: dto.amenities || [],
        images: dto.images || [],
        bedType: dto.bedType || 'King Bed',
        bedCount: dto.bedCount || 1,
        roomSize: dto.roomSize,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
        sortOrder: dto.sortOrder || 0,
      },
    });
  }

  async findCategories(hotelId: string) {
    return this.prisma.roomCategory.findMany({
      where: { hotelId },
      include: {
        _count: {
          select: { rooms: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async updateCategory(id: string, hotelId: string, dto: Partial<CreateCategoryDto>) {
    return this.prisma.roomCategory.update({
      where: { id },
      data: dto as any,
    });
  }

  async deleteCategory(id: string, hotelId: string) {
    return this.prisma.roomCategory.delete({
      where: { id },
    });
  }

  // ─── Rooms ─────────────────────────────────────────────────────────────────

  async createRoom(hotelId: string, dto: CreateRoomDto) {
    const existing = await this.prisma.room.findUnique({
      where: {
        hotelId_roomNumber: { hotelId, roomNumber: dto.roomNumber },
      },
    });

    if (existing) {
      throw new ConflictException(`Room ${dto.roomNumber} already exists in this hotel`);
    }

    const room = await this.prisma.room.create({
      data: {
        hotelId,
        categoryId: dto.categoryId,
        roomNumber: dto.roomNumber,
        floor: dto.floor || 1,
        status: (dto.status as any) || 'AVAILABLE',
        description: dto.description,
        amenities: dto.amenities || [],
        images: dto.images || [],
        isSmokingAllowed: dto.isSmokingAllowed || false,
        hasBalcony: dto.hasBalcony || false,
        hasSeaView: dto.hasSeaView || false,
        hasMountainView: dto.hasMountainView || false,
        notes: dto.notes,
      },
    });

    // Update totalRooms on hotel
    const count = await this.prisma.room.count({ where: { hotelId } });
    await this.prisma.hotel.update({
      where: { id: hotelId },
      data: { totalRooms: count },
    });

    return room;
  }

  async findRooms(
    hotelId: string,
    query?: {
      floor?: number;
      categoryId?: string;
      status?: string;
      search?: string;
    }
  ) {
    const where: any = { hotelId };

    if (query?.floor) where.floor = Number(query.floor);
    if (query?.categoryId) where.categoryId = query.categoryId;
    if (query?.status) where.status = query.status;
    if (query?.search) {
      where.roomNumber = { contains: query.search };
    }

    return this.prisma.room.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            basePrice: true,
            maxOccupancy: true,
          },
        },
      },
      orderBy: [{ floor: 'asc' }, { roomNumber: 'asc' }],
    });
  }

  async updateRoom(id: string, hotelId: string, dto: UpdateRoomDto) {
    return this.prisma.room.update({
      where: { id },
      data: dto as any,
    });
  }

  async updateStatus(id: string, hotelId: string, status: string) {
    const room = await this.prisma.room.update({
      where: { id },
      data: { status: status as any },
    });

    // If cleaning is required, auto-create a housekeeping task
    if (status === 'CLEANING_REQUIRED') {
      await this.prisma.housekeepingTask.create({
        data: {
          hotelId,
          roomId: id,
          status: 'PENDING',
          priority: 'MEDIUM',
          type: 'STAY_CLEAN',
          checklist: [
            { item: 'Change linens and make beds', completed: false },
            { item: 'Dust all surfaces and furniture', completed: false },
            { item: 'Clean and sanitize bathroom & fixtures', completed: false },
            { item: 'Replenish towels and amenities', completed: false },
            { item: 'Vacuum carpets and mop floors', completed: false },
            { item: 'Empty trash bins and replace liners', completed: false },
          ],
        },
      });
    }

    return room;
  }

  // ─── Real-time Availability & Overlap Protection ───────────────────────────

  async checkAvailability(
    hotelId: string,
    checkInDate: Date | string,
    checkOutDate: Date | string,
    guests = 1
  ) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Find all overlapping bookings that are confirmed or checked-in
    const overlappingBookings = await this.prisma.booking.findMany({
      where: {
        hotelId,
        status: { in: ['CONFIRMED', 'CHECKED_IN', 'AWAITING_PAYMENT'] },
        AND: [
          { checkIn: { lt: checkOut } },
          { checkOut: { gt: checkIn } },
        ],
      },
      select: {
        bookingRooms: {
          select: { roomId: true },
        },
      },
    });

    const bookedRoomIds = new Set<string>();
    for (const b of overlappingBookings) {
      for (const br of b.bookingRooms) {
        bookedRoomIds.add(br.roomId);
      }
    }

    // Get categories and their available rooms
    const categories = await this.prisma.roomCategory.findMany({
      where: {
        hotelId,
        isActive: true,
        maxOccupancy: { gte: guests },
      },
      include: {
        rooms: {
          where: {
            isActive: true,
            status: { notIn: ['OUT_OF_SERVICE', 'MAINTENANCE'] },
          },
        },
      },
    });

    return categories.map((cat) => {
      const availableRooms = cat.rooms.filter((r) => !bookedRoomIds.has(r.id));
      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        basePrice: cat.basePrice,
        maxOccupancy: cat.maxOccupancy,
        bedType: cat.bedType,
        bedCount: cat.bedCount,
        amenities: cat.amenities,
        images: cat.images,
        totalRooms: cat.rooms.length,
        availableCount: availableRooms.length,
        isAvailable: availableRooms.length > 0,
        availableRooms: availableRooms.map((r) => ({
          id: r.id,
          roomNumber: r.roomNumber,
          floor: r.floor,
          status: r.status,
        })),
      };
    });
  }
}

