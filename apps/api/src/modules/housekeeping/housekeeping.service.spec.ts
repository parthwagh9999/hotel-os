import { NotFoundException } from '@nestjs/common';
import { HousekeepingService } from './housekeeping.service';

describe('HousekeepingService', () => {
  const mockPrisma: any = {
    housekeepingTask: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    room: {
      update: jest.fn(),
    },
  };

  let service: HousekeepingService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new HousekeepingService(mockPrisma);
  });

  it('blocks cross-tenant housekeeping task status manipulation', async () => {
    mockPrisma.housekeepingTask.findFirst.mockResolvedValue(null);

    await expect(
      service.updateTaskStatus('hotel-a', 'task-from-hotel-b', 'INSPECTED', 'Inspector')
    ).rejects.toThrow(NotFoundException);
    expect(mockPrisma.room.update).not.toHaveBeenCalled();
  });

  it('restores room to AVAILABLE when task is marked INSPECTED', async () => {
    mockPrisma.housekeepingTask.findFirst.mockResolvedValue({
      id: 'task-1',
      hotelId: 'hotel-1',
      roomId: 'room-1',
      room: { id: 'room-1', roomNumber: '101' },
    });
    mockPrisma.housekeepingTask.update.mockResolvedValue({ id: 'task-1', status: 'INSPECTED' });

    await service.updateTaskStatus('hotel-1', 'task-1', 'INSPECTED', 'Sunita');

    expect(mockPrisma.room.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'room-1' },
        data: expect.objectContaining({ status: 'AVAILABLE' }),
      })
    );
  });
});

