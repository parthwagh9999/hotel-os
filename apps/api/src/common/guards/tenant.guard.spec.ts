import { ForbiddenException, ExecutionContext } from '@nestjs/common';
import { TenantGuard } from './tenant.guard';

describe('TenantGuard', () => {
  const mockPrisma: any = {
    hotelMember: { findFirst: jest.fn() },
  };

  let guard: TenantGuard;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new TenantGuard(mockPrisma);
  });

  function mockContext(user: any, params: any = {}): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user, params, body: {}, query: {}, headers: {} }),
      }),
    } as unknown as ExecutionContext;
  }

  it('allows SUPER_ADMIN across any tenant', async () => {
    const allowed = await guard.canActivate(
      mockContext({ id: 'admin-1', role: 'SUPER_ADMIN' }, { hotelId: 'hotel-99' })
    );
    expect(allowed).toBe(true);
  });

  it('denies access when user is not an active member of target hotel', async () => {
    mockPrisma.hotelMember.findFirst.mockResolvedValue(null);

    await expect(
      guard.canActivate(mockContext({ id: 'user-1', role: 'HOTEL_OWNER' }, { hotelId: 'hotel-b' }))
    ).rejects.toThrow(ForbiddenException);
  });
});

