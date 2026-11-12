import { NotFoundException } from '@nestjs/common';
import { RoomsService } from './rooms.service';

describe('RoomsService', () => {
  const mockPrisma: any = {
    roomCategory: {
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    room: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    housekeepingTask: {
      create: jest.fn(),
    },
  };

  let service: RoomsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RoomsService(mockPrisma);
  });

  it('prevents cross-tenant room status updates when room does not belong to hotelId', async () => {
    mockPrisma.room.findFirst.mockResolvedValue(null);

    await expect(service.updateStatus('room-from-hotel-b', 'hotel-a', 'MAINTENANCE')).rejects.toThrow(
      NotFoundException
    );
    expect(mockPrisma.room.update).not.toHaveBeenCalled();
  });

  it('prevents cross-tenant category deletion', async () => {
    mockPrisma.roomCategory.findFirst.mockResolvedValue(null);

    await expect(service.deleteCategory('cat-from-hotel-b', 'hotel-a')).rejects.toThrow(
      NotFoundException
    );
    expect(mockPrisma.roomCategory.delete).not.toHaveBeenCalled();
  });

  it('creates a housekeeping task when room transitions to CLEANING_REQUIRED', async () => {
    mockPrisma.room.findFirst.mockResolvedValue({ id: 'room-1', hotelId: 'hotel-1' });
    mockPrisma.room.update.mockResolvedValue({ id: 'room-1', status: 'CLEANING_REQUIRED' });

    await service.updateStatus('room-1', 'hotel-1', 'CLEANING_REQUIRED');

    expect(mockPrisma.housekeepingTask.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.housekeepingTask.create.mock.calls[0][0].data.hotelId).toBe('hotel-1');
  });
});

