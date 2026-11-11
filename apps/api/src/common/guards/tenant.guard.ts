import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User authentication required');
    }

    // Platform Super Admin bypasses tenant isolation
    if (user.role === 'SUPER_ADMIN' || user.role === 'PLATFORM_ADMIN') {
      return true;
    }

    const hotelId =
      request.params?.hotelId ||
      request.body?.hotelId ||
      request.query?.hotelId ||
      request.headers['x-tenant-id'];

    if (!hotelId) {
      // If no specific tenant is targeted, allow authenticated user
      return true;
    }

    // Verify user is an active member of this hotel
    const membership = await this.prisma.hotelMember.findFirst({
      where: {
        hotelId,
        userId: user.id,
        isActive: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Access denied: You are not authorized for this hotel');
    }

    // Attach membership context to request
    request.hotelMember = membership;
    return true;
  }
}

