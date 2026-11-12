import { ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { BookingsService } from './bookings.service';

describe('BookingsService', () => {
  const mockPrisma: any = {
    room: { findFirst: jest.fn(), update: jest.fn() },
    booking: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    hotelMember: { findFirst: jest.fn() },
    $transaction: jest.fn(),
  };

  let service: BookingsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BookingsService(mockPrisma);
  });

  it('rejects check-out before or equal to check-in date', async () => {
    await expect(
      service.create(null, {
        hotelId: 'hotel-1',
        roomId: 'room-1',
        checkInDate: '2025-06-18T14:00:00Z',
        checkOutDate: '2025-06-15T11:00:00Z',
        guests: 2,
      } as any)
    ).rejects.toThrow(BadRequestException);
  });

  it('prevents overlapping reservations with ConflictException', async () => {
    mockPrisma.room.findFirst.mockResolvedValue({
      id: 'room-1',
      hotelId: 'hotel-1',
      category: { basePrice: 12500 },
    });
    mockPrisma.booking.findFirst.mockResolvedValue({ id: 'existing-booking' });

    await expect(
      service.create('user-1', {
        hotelId: 'hotel-1',
        roomId: 'room-1',
        checkInDate: '2025-06-15T14:00:00Z',
        checkOutDate: '2025-06-18T11:00:00Z',
        guests: 2,
      } as any)
    ).rejects.toThrow(ConflictException);
  });

  it('blocks unauthorized staff from checking in another hotel booking (BOLA prevention)', async () => {
    mockPrisma.booking.findUnique.mockResolvedValue({
      id: 'booking-hotel-a',
      hotelId: 'hotel-a',
      status: 'CONFIRMED',
      bookingRooms: [],
    });
    mockPrisma.hotelMember.findFirst.mockResolvedValue(null);

    await expect(
      service.checkIn('booking-hotel-a', {
        id: 'attacker-user',
        role: 'HOTEL_OWNER',
        firstName: 'Attacker',
      })
    ).rejects.toThrow(ForbiddenException);
  });

  it('allows authorized hotel staff to check in their hotel booking', async () => {
    mockPrisma.booking.findUnique.mockResolvedValue({
      id: 'booking-1',
      hotelId: 'hotel-1',
      status: 'CONFIRMED',
      bookingRooms: [{ roomId: 'room-1' }],
    });
    mockPrisma.hotelMember.findFirst.mockResolvedValue({ id: 'member-1', role: 'RECEPTIONIST' });
    mockPrisma.$transaction.mockImplementation(async (fn: any) =>
      fn({
        booking: {
          update: jest.fn().mockResolvedValue({ id: 'booking-1', status: 'CHECKED_IN' }),
        },
        room: {
          update: jest.fn().mockResolvedValue({ id: 'room-1', status: 'OCCUPIED' }),
        },
      })
    );

    const res = await service.checkIn('booking-1', {
      id: 'staff-1',
      role: 'RECEPTIONIST',
      firstName: 'Aarti',
    });

    expect(res.status).toBe('CHECKED_IN');
  });

  it('blocks non-owner non-staff customer from cancelling another user booking', async () => {
    mockPrisma.booking.findUnique.mockResolvedValue({
      id: 'booking-1',
      hotelId: 'hotel-1',
      userId: 'victim-user',
      status: 'CONFIRMED',
      bookingRooms: [],
    });
    mockPrisma.hotelMember.findFirst.mockResolvedValue(null);

    await expect(
      service.cancel('booking-1', { id: 'other-customer', role: 'CUSTOMER' }, 'Malicious cancel')
    ).rejects.toThrow(ForbiddenException);
  });
});

