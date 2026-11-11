// ─── Hotel OS — Database Seed ────────────────────────────────────────────────
// Idempotent seed: safe to run multiple times (uses upsert throughout)
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function bookingRef(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `HOS-${code}`;
}

function futureDate(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function pastDate(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

// ─── Main Seed ───────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding Hotel OS database...\n');

  // ── 1. Users ─────────────────────────────────────────────────────────────

  const adminHash = await argon2.hash('HotelOS@2024');
  const ownerHash = await argon2.hash('Demo@2024');
  const customerHash = await argon2.hash('Customer@2024');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hotel-os.dev' },
    update: {},
    create: {
      email: 'admin@hotel-os.dev',
      passwordHash: adminHash,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      isEmailVerified: true,
      isPhoneVerified: true,
      phone: '+919000000001',
    },
  });
  console.log('  ✓ Super Admin created');

  const owner = await prisma.user.upsert({
    where: { email: 'owner@demo-hotel.com' },
    update: {},
    create: {
      email: 'owner@demo-hotel.com',
      passwordHash: ownerHash,
      firstName: 'Rajesh',
      lastName: 'Sharma',
      role: 'HOTEL_OWNER',
      isEmailVerified: true,
      phone: '+919000000002',
    },
  });
  console.log('  ✓ Hotel Owner created');

  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      passwordHash: customerHash,
      firstName: 'Priya',
      lastName: 'Patel',
      role: 'CUSTOMER',
      isEmailVerified: true,
      phone: '+919000000003',
    },
  });
  console.log('  ✓ Customer created');

  // ── 2. Organization ──────────────────────────────────────────────────────

  const org = await prisma.organization.upsert({
    where: { slug: 'demo-hotel-group' },
    update: {},
    create: {
      name: 'Demo Hotel Group',
      slug: 'demo-hotel-group',
      description: 'A demonstration hotel group for Hotel OS platform.',
      contactEmail: 'info@demo-hotel-group.com',
      contactPhone: '+912200000001',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400001',
    },
  });
  console.log('  ✓ Organization created');

  // ── 3. Hotels ────────────────────────────────────────────────────────────

  const grandPalace = await prisma.hotel.upsert({
    where: { slug: 'grand-palace-hotel-mumbai' },
    update: {},
    create: {
      organizationId: org.id,
      name: 'Grand Palace Hotel',
      slug: 'grand-palace-hotel-mumbai',
      type: 'HOTEL',
      description:
        'A luxury 5-star hotel located in the heart of South Mumbai with panoramic views of the Arabian Sea. Features world-class amenities, fine dining restaurants, and a rooftop infinity pool.',
      contactEmail: 'reception@grandpalace.com',
      contactPhone: '+912244001000',
      website: 'https://grandpalace-demo.hotel-os.dev',
      address: '123 Marine Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400020',
      latitude: 18.9438,
      longitude: 72.8234,
      starRating: 5,
      checkInTime: '14:00',
      checkOutTime: '12:00',
      cancellationPolicyHours: 48,
      status: 'APPROVED',
      rank: 'GOLD',
      isVerified: true,
      isFeatured: true,
      totalRooms: 20,
      totalFloors: 8,
      amenities: [
        'WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room Service',
        'Parking', 'Business Center', 'Concierge', 'Laundry', 'Airport Transfer',
      ],
      policies: {
        cancellation: 'Free cancellation up to 48 hours before check-in.',
        children: 'Children under 5 stay free.',
        pets: 'Pets are not allowed.',
        smoking: 'Non-smoking property.',
      },
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      gstNumber: '27AAACG0001A1Z5',
      panNumber: 'AAACG0001A',
    },
  });
  console.log('  ✓ Grand Palace Hotel created');

  const budgetInn = await prisma.hotel.upsert({
    where: { slug: 'budget-inn-mumbai' },
    update: {},
    create: {
      organizationId: org.id,
      name: 'Budget Inn',
      slug: 'budget-inn-mumbai',
      type: 'HOTEL',
      description:
        'An affordable, comfortable budget hotel near Mumbai Central railway station. Clean rooms, friendly staff, and convenient access to public transport.',
      contactEmail: 'reception@budgetinn.com',
      contactPhone: '+912244002000',
      website: 'https://budgetinn-demo.hotel-os.dev',
      address: '45 Station Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400008',
      latitude: 18.9696,
      longitude: 72.8194,
      starRating: 3,
      checkInTime: '12:00',
      checkOutTime: '11:00',
      cancellationPolicyHours: 24,
      status: 'APPROVED',
      rank: 'SILVER',
      isVerified: true,
      isFeatured: false,
      totalRooms: 20,
      totalFloors: 4,
      amenities: ['WiFi', 'Restaurant', 'Parking', 'Laundry', 'Room Service', '24h Front Desk'],
      policies: {
        cancellation: 'Free cancellation up to 24 hours before check-in.',
        children: 'Children under 5 stay free.',
        pets: 'Pets are not allowed.',
        smoking: 'Smoking rooms available on request.',
      },
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      gstNumber: '27AAACB0002A1Z6',
      panNumber: 'AAACB0002A',
    },
  });
  console.log('  ✓ Budget Inn created');

  // ── 4. Hotel Members ─────────────────────────────────────────────────────

  await prisma.hotelMember.upsert({
    where: { hotelId_userId: { hotelId: grandPalace.id, userId: owner.id } },
    update: {},
    create: { hotelId: grandPalace.id, userId: owner.id, role: 'HOTEL_OWNER' },
  });

  await prisma.hotelMember.upsert({
    where: { hotelId_userId: { hotelId: budgetInn.id, userId: owner.id } },
    update: {},
    create: { hotelId: budgetInn.id, userId: owner.id, role: 'HOTEL_OWNER' },
  });
  console.log('  ✓ Hotel members created');

  // ── 5. Room Categories & Rooms ────────────────────────────────────────────

  const categoryDefs = [
    {
      name: 'Standard',
      slug: 'standard',
      basePrice: 3000,
      extraPersonCharge: 500,
      maxOccupancy: 2,
      bedType: 'Double',
      bedCount: 1,
      roomSize: '250 sq ft',
      roomCount: 6,
      amenities: ['WiFi', 'TV', 'AC', 'Hot Water', 'Wardrobe'],
    },
    {
      name: 'Deluxe',
      slug: 'deluxe',
      basePrice: 5000,
      extraPersonCharge: 800,
      maxOccupancy: 2,
      bedType: 'King',
      bedCount: 1,
      roomSize: '350 sq ft',
      roomCount: 5,
      amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Safe', 'Hot Water', 'Wardrobe', 'Work Desk'],
    },
    {
      name: 'Super Deluxe',
      slug: 'super-deluxe',
      basePrice: 7500,
      extraPersonCharge: 1000,
      maxOccupancy: 3,
      bedType: 'King',
      bedCount: 1,
      roomSize: '450 sq ft',
      roomCount: 4,
      amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Safe', 'Bathtub', 'Work Desk', 'City View'],
    },
    {
      name: 'Suite',
      slug: 'suite',
      basePrice: 12000,
      extraPersonCharge: 1500,
      maxOccupancy: 3,
      bedType: 'King',
      bedCount: 1,
      roomSize: '650 sq ft',
      roomCount: 3,
      amenities: [
        'WiFi', 'TV', 'AC', 'Mini Bar', 'Safe', 'Bathtub', 'Living Area',
        'Work Desk', 'Sea View', 'Room Service',
      ],
    },
    {
      name: 'Family',
      slug: 'family',
      basePrice: 9000,
      extraPersonCharge: 1200,
      maxOccupancy: 4,
      bedType: 'Twin + Double',
      bedCount: 2,
      roomSize: '550 sq ft',
      roomCount: 2,
      amenities: [
        'WiFi', 'TV', 'AC', 'Mini Bar', 'Safe', 'Hot Water',
        'Extra Beds Available', 'Child-friendly',
      ],
    },
  ];

  // Budget-hotel price multiplier (lower prices)
  const budgetPriceMultiplier = 0.4;

  for (const hotel of [grandPalace, budgetInn]) {
    const isGrand = hotel.id === grandPalace.id;
    const multiplier = isGrand ? 1 : budgetPriceMultiplier;
    let roomCounter = 0;

    for (let ci = 0; ci < categoryDefs.length; ci++) {
      const def = categoryDefs[ci];
      const cat = await prisma.roomCategory.upsert({
        where: { hotelId_slug: { hotelId: hotel.id, slug: def.slug } },
        update: {},
        create: {
          hotelId: hotel.id,
          name: def.name,
          slug: def.slug,
          description: `${def.name} room at ${hotel.name}`,
          basePrice: Math.round(def.basePrice * multiplier),
          extraPersonCharge: Math.round(def.extraPersonCharge * multiplier),
          maxOccupancy: def.maxOccupancy,
          bedType: def.bedType,
          bedCount: def.bedCount,
          roomSize: def.roomSize,
          amenities: def.amenities,
          images: [],
          isActive: true,
          sortOrder: ci,
        },
      });

      // Create rooms for this category
      for (let ri = 0; ri < def.roomCount; ri++) {
        roomCounter++;
        const floor = Math.min(Math.ceil(roomCounter / 3), isGrand ? 8 : 4);
        const roomNumber = `${floor}${String(roomCounter).padStart(2, '0')}`;

        await prisma.room.upsert({
          where: { hotelId_roomNumber: { hotelId: hotel.id, roomNumber } },
          update: {},
          create: {
            hotelId: hotel.id,
            categoryId: cat.id,
            roomNumber,
            floor,
            status: 'AVAILABLE',
            amenities: def.amenities,
            isActive: true,
            isSmokingAllowed: false,
            hasBalcony: ci >= 2, // Super Deluxe and above
            hasSeaView: isGrand && ci >= 3, // Suite only at Grand Palace
          },
        });
      }
    }

    console.log(`  ✓ Room categories & ${roomCounter} rooms created for ${hotel.name}`);
  }

  // ── 6. Subscriptions ─────────────────────────────────────────────────────

  const now = new Date();
  const oneYearLater = new Date(now);
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  for (const hotel of [grandPalace, budgetInn]) {
    await prisma.subscription.upsert({
      where: { hotelId: hotel.id },
      update: {},
      create: {
        hotelId: hotel.id,
        plan: 'PROFESSIONAL',
        status: 'ACTIVE',
        startDate: now,
        endDate: oneYearLater,
        amount: 4999,
        currency: 'INR',
        autoRenew: true,
        maxProperties: 3,
        maxRooms: 100,
        maxStaff: 25,
        features: ['analytics', 'reports', 'housekeeping', 'maintenance', 'invoicing', 'guest-crm'],
      },
    });
  }
  console.log('  ✓ Subscriptions created');

  // ── 7. Sample Bookings ────────────────────────────────────────────────────

  // Fetch rooms for booking assignment
  const grandRooms = await prisma.room.findMany({
    where: { hotelId: grandPalace.id },
    orderBy: { roomNumber: 'asc' },
    take: 5,
  });

  const bookingData = [
    {
      ref: 'HOS-GP0001',
      hotelId: grandPalace.id,
      userId: customer.id,
      guestName: 'Priya Patel',
      guestEmail: 'customer@example.com',
      guestPhone: '+919000000003',
      checkIn: pastDate(10),
      checkOut: pastDate(7),
      adults: 2,
      children: 0,
      totalAmount: 15000,
      taxAmount: 2700,
      paidAmount: 17700,
      status: 'CHECKED_OUT' as const,
      source: 'WEBSITE' as const,
      checkedInAt: pastDate(10),
      checkedOutAt: pastDate(7),
      roomIdx: 0,
    },
    {
      ref: 'HOS-GP0002',
      hotelId: grandPalace.id,
      userId: customer.id,
      guestName: 'Priya Patel',
      guestEmail: 'customer@example.com',
      guestPhone: '+919000000003',
      checkIn: futureDate(5),
      checkOut: futureDate(8),
      adults: 2,
      children: 1,
      totalAmount: 36000,
      taxAmount: 6480,
      paidAmount: 42480,
      status: 'CONFIRMED' as const,
      source: 'WEBSITE' as const,
      roomIdx: 1,
    },
    {
      ref: 'HOS-GP0003',
      hotelId: grandPalace.id,
      userId: null,
      guestName: 'Amit Kumar',
      guestEmail: 'amit.kumar@example.com',
      guestPhone: '+919876543210',
      checkIn: futureDate(2),
      checkOut: futureDate(4),
      adults: 1,
      children: 0,
      totalAmount: 10000,
      taxAmount: 1800,
      paidAmount: 0,
      status: 'AWAITING_PAYMENT' as const,
      source: 'WALK_IN' as const,
      roomIdx: 2,
    },
    {
      ref: 'HOS-GP0004',
      hotelId: grandPalace.id,
      userId: null,
      guestName: 'Sarah Johnson',
      guestEmail: 'sarah.j@example.com',
      guestPhone: '+14155550100',
      checkIn: pastDate(3),
      checkOut: futureDate(1),
      adults: 2,
      children: 0,
      totalAmount: 48000,
      taxAmount: 8640,
      paidAmount: 56640,
      status: 'CHECKED_IN' as const,
      source: 'OTA' as const,
      checkedInAt: pastDate(3),
      roomIdx: 3,
    },
    {
      ref: 'HOS-GP0005',
      hotelId: grandPalace.id,
      userId: null,
      guestName: 'Ravi Verma',
      guestEmail: 'ravi.v@example.com',
      guestPhone: '+919988776655',
      checkIn: pastDate(15),
      checkOut: pastDate(13),
      adults: 1,
      children: 0,
      totalAmount: 6000,
      taxAmount: 720,
      paidAmount: 6720,
      status: 'CANCELLED' as const,
      source: 'PHONE' as const,
      cancellationReason: 'Change of plans',
      cancelledAt: pastDate(16),
      roomIdx: 4,
    },
  ];

  for (const b of bookingData) {
    const booking = await prisma.booking.upsert({
      where: { bookingRef: b.ref },
      update: {},
      create: {
        bookingRef: b.ref,
        hotelId: b.hotelId,
        userId: b.userId,
        guestName: b.guestName,
        guestEmail: b.guestEmail,
        guestPhone: b.guestPhone,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        adults: b.adults,
        children: b.children,
        totalAmount: b.totalAmount,
        taxAmount: b.taxAmount,
        paidAmount: b.paidAmount,
        status: b.status,
        source: b.source,
        cancellationReason: (b as any).cancellationReason ?? null,
        cancelledAt: (b as any).cancelledAt ?? null,
        checkedInAt: (b as any).checkedInAt ?? null,
        checkedOutAt: (b as any).checkedOutAt ?? null,
      },
    });

    // Link booking to room (skip if room doesn't exist)
    if (grandRooms[b.roomIdx]) {
      await prisma.bookingRoom.upsert({
        where: {
          bookingId_roomId: { bookingId: booking.id, roomId: grandRooms[b.roomIdx].id },
        },
        update: {},
        create: {
          bookingId: booking.id,
          roomId: grandRooms[b.roomIdx].id,
          pricePerNight: b.totalAmount / Math.max(1, Math.ceil((b.checkOut.getTime() - b.checkIn.getTime()) / 86400000)),
        },
      });
    }
  }
  console.log('  ✓ 5 sample bookings created');

  // ── 8. Sample Reviews ─────────────────────────────────────────────────────

  // Fetch the checked-out booking for the review
  const checkedOutBooking = await prisma.booking.findUnique({
    where: { bookingRef: 'HOS-GP0001' },
  });

  if (checkedOutBooking) {
    await prisma.review.upsert({
      where: { bookingId: checkedOutBooking.id },
      update: {},
      create: {
        hotelId: grandPalace.id,
        bookingId: checkedOutBooking.id,
        userId: customer.id,
        overallRating: 5,
        cleanlinessRating: 5,
        serviceRating: 5,
        locationRating: 5,
        valueRating: 4,
        title: 'Absolutely wonderful stay!',
        content:
          'We had an amazing experience at Grand Palace Hotel. The staff was incredibly attentive, rooms were spotless, and the sea view was breathtaking. Will definitely return!',
        pros: 'Excellent service, clean rooms, stunning views, great food',
        cons: 'Slightly overpriced breakfast buffet',
        status: 'APPROVED',
        isVerifiedStay: true,
        images: [],
      },
    });
  }

  // Create two more guest users and bookings for additional reviews
  const guest2Hash = await argon2.hash('Guest2@2024');
  const guest2 = await prisma.user.upsert({
    where: { email: 'guest2@example.com' },
    update: {},
    create: {
      email: 'guest2@example.com',
      passwordHash: guest2Hash,
      firstName: 'Anita',
      lastName: 'Desai',
      role: 'CUSTOMER',
      isEmailVerified: true,
      phone: '+919000000004',
    },
  });

  const guest3Hash = await argon2.hash('Guest3@2024');
  const guest3 = await prisma.user.upsert({
    where: { email: 'guest3@example.com' },
    update: {},
    create: {
      email: 'guest3@example.com',
      passwordHash: guest3Hash,
      firstName: 'David',
      lastName: 'Wilson',
      role: 'CUSTOMER',
      isEmailVerified: true,
      phone: '+919000000005',
    },
  });

  // Extra bookings for reviews
  const reviewBooking2 = await prisma.booking.upsert({
    where: { bookingRef: 'HOS-GP0006' },
    update: {},
    create: {
      bookingRef: 'HOS-GP0006',
      hotelId: grandPalace.id,
      userId: guest2.id,
      guestName: 'Anita Desai',
      guestEmail: 'guest2@example.com',
      checkIn: pastDate(30),
      checkOut: pastDate(28),
      adults: 2,
      totalAmount: 10000,
      taxAmount: 1800,
      paidAmount: 11800,
      status: 'CHECKED_OUT',
      source: 'WEBSITE',
      checkedInAt: pastDate(30),
      checkedOutAt: pastDate(28),
    },
  });

  await prisma.review.upsert({
    where: { bookingId: reviewBooking2.id },
    update: {},
    create: {
      hotelId: grandPalace.id,
      bookingId: reviewBooking2.id,
      userId: guest2.id,
      overallRating: 4,
      cleanlinessRating: 4,
      serviceRating: 4,
      locationRating: 5,
      valueRating: 3,
      title: 'Great location, good service',
      content:
        'Lovely hotel with a prime location on Marine Drive. Rooms are well-maintained. The only downside is the pricing — a bit steep for what you get.',
      pros: 'Location, clean rooms, helpful staff',
      cons: 'Overpriced, slow room service during peak hours',
      status: 'APPROVED',
      isVerifiedStay: true,
      images: [],
    },
  });

  const reviewBooking3 = await prisma.booking.upsert({
    where: { bookingRef: 'HOS-GP0007' },
    update: {},
    create: {
      bookingRef: 'HOS-GP0007',
      hotelId: grandPalace.id,
      userId: guest3.id,
      guestName: 'David Wilson',
      guestEmail: 'guest3@example.com',
      checkIn: pastDate(20),
      checkOut: pastDate(17),
      adults: 1,
      totalAmount: 22500,
      taxAmount: 4050,
      paidAmount: 26550,
      status: 'CHECKED_OUT',
      source: 'OTA',
      checkedInAt: pastDate(20),
      checkedOutAt: pastDate(17),
    },
  });

  await prisma.review.upsert({
    where: { bookingId: reviewBooking3.id },
    update: {},
    create: {
      hotelId: grandPalace.id,
      bookingId: reviewBooking3.id,
      userId: guest3.id,
      overallRating: 4,
      cleanlinessRating: 5,
      serviceRating: 4,
      locationRating: 5,
      valueRating: 4,
      title: 'Business trip — very comfortable',
      content:
        'Stayed for a business trip. The business center was well-equipped, WiFi was fast, and the bed was very comfortable. Would recommend for corporate stays.',
      pros: 'Fast WiFi, comfortable beds, business center, professional staff',
      cons: 'Limited vegetarian options at the restaurant',
      status: 'PENDING',
      isVerifiedStay: true,
      images: [],
    },
  });
  console.log('  ✓ 3 reviews created');

  // ── 9. Tax Configurations ─────────────────────────────────────────────────

  // Platform-level GST rates as per Indian hospitality norms
  const taxConfigs = [
    { name: 'GST 0% (up to ₹1,000)', rate: 0, type: 'GST', applicableAbove: null },
    { name: 'GST 12% (₹1,001 – ₹7,500)', rate: 12, type: 'GST', applicableAbove: 1000 },
    { name: 'GST 18% (above ₹7,500)', rate: 18, type: 'GST', applicableAbove: 7500 },
  ];

  for (const tc of taxConfigs) {
    // Use a deterministic approach — find-or-create
    const existing = await prisma.taxConfiguration.findFirst({
      where: { name: tc.name, hotelId: null },
    });
    if (!existing) {
      await prisma.taxConfiguration.create({
        data: {
          hotelId: null,
          name: tc.name,
          rate: tc.rate,
          type: tc.type,
          applicableAbove: tc.applicableAbove,
          isActive: true,
        },
      });
    }
  }
  console.log('  ✓ Tax configurations created');

  // ── 10. Feature Flags ─────────────────────────────────────────────────────

  const featureFlags = [
    {
      name: 'AI_PREDICTIONS',
      description: 'Enable AI-powered occupancy and revenue predictions',
    },
    {
      name: 'RESTAURANT_MODULE',
      description: 'Enable restaurant / F&B management module',
    },
    {
      name: 'LOYALTY_PROGRAM',
      description: 'Enable guest loyalty points program',
    },
  ];

  for (const ff of featureFlags) {
    await prisma.featureFlag.upsert({
      where: { name: ff.name },
      update: {},
      create: {
        name: ff.name,
        description: ff.description,
        status: 'ENABLED',
      },
    });
  }
  console.log('  ✓ Feature flags created');

  // ── 11. Departments ───────────────────────────────────────────────────────

  for (const hotel of [grandPalace, budgetInn]) {
    for (const dept of ['Front Office', 'Housekeeping']) {
      await prisma.department.upsert({
        where: { hotelId_name: { hotelId: hotel.id, name: dept } },
        update: {},
        create: {
          hotelId: hotel.id,
          name: dept,
          description: `${dept} department at ${hotel.name}`,
          isActive: true,
        },
      });
    }
  }
  console.log('  ✓ Departments created');

  // ── 12. Loyalty Account ───────────────────────────────────────────────────

  await prisma.loyaltyAccount.upsert({
    where: { userId: customer.id },
    update: {},
    create: {
      userId: customer.id,
      tier: 'SILVER',
      totalPoints: 2500,
      availablePoints: 2000,
      lifetimePoints: 3500,
      tierExpiresAt: oneYearLater,
    },
  });
  console.log('  ✓ Loyalty account created');

  // ── Done ──────────────────────────────────────────────────────────────────

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
