import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HousekeepingService {
  constructor(private prisma: PrismaService) {}

  async findTasks(hotelId: string, status?: string) {
    const where: any = { hotelId };
    if (status) where.status = status;

    return this.prisma.housekeepingTask.findMany({
      where,
      include: {
        room: {
          select: {
            id: true,
            roomNumber: true,
            floor: true,
            status: true,
          },
        },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async createTask(
    hotelId: string,
    data: {
      roomId: string;
      assignedTo?: string;
      priority?: string;
      type?: string;
      notes?: string;
    }
  ) {
    return this.prisma.housekeepingTask.create({
      data: {
        hotelId,
        roomId: data.roomId,
        assignedTo: data.assignedTo || null,
        status: data.assignedTo ? 'ASSIGNED' : 'PENDING',
        priority: (data.priority as any) || 'MEDIUM',
        type: (data.type as any) || 'STAY_CLEAN',
        notes: data.notes,
        checklist: [
          { item: 'Replace bed linen and towels', completed: false },
          { item: 'Sanitize bathroom and surfaces', completed: false },
          { item: 'Vacuum and mop floors', completed: false },
          { item: 'Restock toiletries and tea amenities', completed: false },
          { item: 'Check all appliances and lights', completed: false },
        ],
      },
      include: { room: true },
    });
  }

  private async findTaskOrFail(hotelId: string, taskId: string) {
    const task = await this.prisma.housekeepingTask.findFirst({
      where: { id: taskId, hotelId },
      include: { room: true },
    });

    if (!task) {
      throw new NotFoundException('Housekeeping task not found in this hotel');
    }

    return task;
  }

  async updateTaskStatus(
    hotelId: string,
    taskId: string,
    status: string,
    inspectedBy?: string
  ) {
    const task = await this.findTaskOrFail(hotelId, taskId);

    const updateData: any = { status };

    if (status === 'IN_PROGRESS' && !task.startedAt) {
      updateData.startedAt = new Date();
      await this.prisma.room.update({
        where: { id: task.roomId },
        data: { status: 'CLEANING_IN_PROGRESS' },
      });
    }

    if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }

    if (status === 'INSPECTED') {
      updateData.inspectedAt = new Date();
      updateData.inspectedBy = inspectedBy || 'Housekeeping Manager';
      // Mark room as AVAILABLE
      await this.prisma.room.update({
        where: { id: task.roomId },
        data: {
          status: 'AVAILABLE',
          lastCleanedAt: new Date(),
        },
      });
    }

    return this.prisma.housekeepingTask.update({
      where: { id: taskId },
      data: updateData,
      include: { room: true },
    });
  }

  async updateChecklist(
    hotelId: string,
    taskId: string,
    checklist: Array<{ item: string; completed: boolean }>
  ) {
    await this.findTaskOrFail(hotelId, taskId);
    return this.prisma.housekeepingTask.update({
      where: { id: taskId },
      data: { checklist },
    });
  }
}

