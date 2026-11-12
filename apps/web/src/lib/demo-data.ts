import { calculateGSTRate } from '@hotel-os/shared';

export interface DemoRoomCategory {
  id: string;
  name: string;
  bedType: string;
  bedCount: number;
  maxOccupancy: number;
  basePrice: number;
  roomSize: string;
  amenities: string[];
  availableCount: number;
  image: string;
}

export interface DemoHotel {
  id: string;
  name: string;
  slug: string;
  type: 'HOTEL' | 'RESORT' | 'BOUTIQUE';
  starRating: number;
  avgRating: number;
  totalReviews: number;
  city: string;
  address: string;
  minPrice: number;
  isFeatured: boolean;
  description: string;
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicyHours: number;
  heroImage: string;
  roomCategories: DemoRoomCategory[];
  reviews: Array<{
    id: string;
    author: string;
    rating: number;
    date: string;
    title: string;
    content: string;
  }>;
}

export interface StoredBooking {
  bookingRef: string;
  hotelSlug: string;
  hotelName: string;
  hotelAddress: string;
  city: string;
  categoryName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  nightlyRate: number;
  gstPercent: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: string;
  specialRequests?: string;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
  createdAt: string;
}

export const DEMO_HOTELS: DemoHotel[] = [
  {
    id: '1',
    name: 'The Grand Palace Hotel & Spa',
    slug: 'the-grand-palace-hotel',
    type: 'HOTEL',
    starRating: 5,
    avgRating: 4.9,
    totalReviews: 342,
    city: 'Mumbai',
    address: 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001',
    minPrice: 12500,
    isFeatured: true,
    description:
      'Ultra-luxurious 5-star heritage sanctuary overlooking the Arabian Sea in South Mumbai. Featuring bespoke butler service, a rooftop infinity pool, and Michelin-grade dining.',
    amenities: [
      'Free High-Speed Wi-Fi',
      'Swimming Pool',
      'Spa & Wellness Sanctuary',
      '24/7 Fine Room Service',
      'Complimentary Gourmet Breakfast',
      'Airport Limousine Transfer',
    ],
    checkInTime: '14:00',
    checkOutTime: '11:00',
    cancellationPolicyHours: 24,
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    roomCategories: [
      {
        id: 'cat-deluxe',
        name: 'Deluxe Heritage Room',
        bedType: 'King Bed',
        bedCount: 1,
        maxOccupancy: 2,
        basePrice: 12500,
        roomSize: '42 sq.m',
        amenities: ['City View', 'Marble Bath', 'Espresso Machine', 'High-Speed Wi-Fi'],
        availableCount: 4,
        image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'cat-super-deluxe',
        name: 'Executive Sea-Facing Suite',
        bedType: 'California King',
        bedCount: 1,
        maxOccupancy: 3,
        basePrice: 18500,
        roomSize: '68 sq.m',
        amenities: ['Sea View', 'Balcony', 'Butler Service', 'Soaking Tub'],
        availableCount: 2,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'cat-presidential',
        name: 'Presidential Royal Suite',
        bedType: 'King Bed + Twin',
        bedCount: 2,
        maxOccupancy: 4,
        basePrice: 35000,
        roomSize: '120 sq.m',
        amenities: ['Private Terrace', 'Jacuzzi', 'Dining Room', 'Complimentary Champagne'],
        availableCount: 1,
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80',
      },
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Priya Sharma',
        rating: 5,
        date: 'May 2025',
        title: 'Impeccable hospitality and breathtaking views',
        content:
          'From seamless mobile check-in to the personalized welcome amenity, our 3-night stay was pure perfection. The rooftop infinity pool at sunset is unmissable.',
      },
      {
        id: 'rev-2',
        author: 'Vikram Mehta',
        rating: 5,
        date: 'April 2025',
        title: 'World-class business and leisure sanctuary',
        content:
          'Super fast Wi-Fi for video conferencing, exquisite breakfast spread, and effortless early check-in.',
      },
    ],
  },
  {
    id: '2',
    name: 'Budget Inn Executive Mumbai',
    slug: 'budget-inn-executive',
    type: 'HOTEL',
    starRating: 3,
    avgRating: 4.4,
    totalReviews: 189,
    city: 'Mumbai',
    address: 'Plot 14, Bandra Kurla Complex (BKC), Mumbai 400051',
    minPrice: 3200,
    isFeatured: false,
    description:
      'Modern, spotless corporate accommodation centrally connected to BKC financial district and metro stations, designed for smart business travelers.',
    amenities: ['Free High-Speed Wi-Fi', 'Air Conditioning', 'Free Parking', 'Complimentary Breakfast', '24/7 Front Desk'],
    checkInTime: '13:00',
    checkOutTime: '11:00',
    cancellationPolicyHours: 24,
    heroImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    roomCategories: [
      {
        id: 'cat-standard-bkc',
        name: 'Smart Business Room',
        bedType: 'Queen Bed',
        bedCount: 1,
        maxOccupancy: 2,
        basePrice: 3200,
        roomSize: '24 sq.m',
        amenities: ['Ergonomic Work Desk', 'Fast Wi-Fi', 'Smart TV', 'Tea/Coffee Kettle'],
        availableCount: 9,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'cat-twin-bkc',
        name: 'Executive Twin Room',
        bedType: '2 Twin Beds',
        bedCount: 2,
        maxOccupancy: 2,
        basePrice: 4800,
        roomSize: '30 sq.m',
        amenities: ['Breakfast Included', 'Laundry Credit', 'Rain Shower', 'City View'],
        availableCount: 5,
        image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=600&q=80',
      },
    ],
    reviews: [
      {
        id: 'rev-3',
        author: 'Sandeep Kulkarni',
        rating: 4,
        date: 'May 2025',
        title: 'Best value stay near BKC offices',
        content: 'Clean rooms, quick express checkout, and GST invoice arrived cleanly by WhatsApp.',
      },
    ],
  },
  {
    id: '3',
    name: 'Azure Palms Beach Resort & Villas',
    slug: 'azure-palms-resort',
    type: 'RESORT',
    starRating: 5,
    avgRating: 4.8,
    totalReviews: 512,
    city: 'Goa',
    address: 'Cavelossim Beachfront Road, South Goa 403731',
    minPrice: 9800,
    isFeatured: true,
    description:
      'Beachfront serenity with tropical gardens, private cabanas, lagoon pool access, and award-winning coastal Goan culinary dining.',
    amenities: [
      'Private Beach Access',
      'Lagoon Infinity Pool',
      'Spa & Wellness',
      'Sunset Cocktail Lounge',
      'Free High-Speed Wi-Fi',
    ],
    checkInTime: '15:00',
    checkOutTime: '11:00',
    cancellationPolicyHours: 48,
    heroImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
    roomCategories: [
      {
        id: 'cat-garden-villa',
        name: 'Tropical Garden Villa',
        bedType: 'King Bed',
        bedCount: 1,
        maxOccupancy: 2,
        basePrice: 9800,
        roomSize: '55 sq.m',
        amenities: ['Private Patio', 'Outdoor Rain Shower', 'Mini Bar', 'Pool Access'],
        availableCount: 6,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'cat-lagoon-suite',
        name: 'Oceanfront Private Pool Villa',
        bedType: 'King Canopy Bed',
        bedCount: 1,
        maxOccupancy: 4,
        basePrice: 22000,
        roomSize: '95 sq.m',
        amenities: ['Private Plunge Pool', 'Ocean Sunset Deck', 'Dedicated Butler', 'Complimentary Spa'],
        availableCount: 2,
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80',
      },
    ],
    reviews: [
      {
        id: 'rev-4',
        author: 'Neha & Arjun Kapoor',
        rating: 5,
        date: 'March 2025',
        title: 'Dream coastal getaway in South Goa',
        content: 'Waking up steps from the Arabian Sea in the plunge pool villa was unforgettable.',
      },
    ],
  },
];

export function findDemoHotelBySlug(slug?: string): DemoHotel {
  if (!slug) return DEMO_HOTELS[0];
  return DEMO_HOTELS.find((h) => h.slug === slug) || DEMO_HOTELS[0];
}

const BOOKINGS_STORAGE_KEY = 'hotel_os_demo_bookings';
const FAVOURITES_STORAGE_KEY = 'hotel_os_favourites';

const DEFAULT_BOOKINGS: StoredBooking[] = [
  {
    bookingRef: 'HOS-7K2X9P',
    hotelSlug: 'the-grand-palace-hotel',
    hotelName: 'The Grand Palace Hotel & Spa',
    hotelAddress: 'Apollo Bunder, Colaba, Mumbai 400001',
    city: 'Mumbai',
    categoryName: 'Deluxe Heritage Room',
    guestName: 'Dr. Anita Roy',
    guestEmail: 'customer@example.com',
    guestPhone: '+91 98201 12345',
    guests: 2,
    checkIn: '2025-06-15',
    checkOut: '2025-06-18',
    nights: 3,
    nightlyRate: 12500,
    gstPercent: calculateGSTRate(12500),
    taxAmount: 6750,
    totalAmount: 44250,
    paymentMethod: 'UPI',
    specialRequests: 'Quiet room on high floor',
    status: 'CONFIRMED',
    createdAt: '2025-06-01T10:30:00Z',
  },
  {
    bookingRef: 'HOS-2R8K4M',
    hotelSlug: 'budget-inn-executive',
    hotelName: 'Budget Inn Executive Mumbai',
    hotelAddress: 'Plot 14, BKC, Mumbai 400051',
    city: 'Mumbai',
    categoryName: 'Smart Business Room',
    guestName: 'John Doe',
    guestEmail: 'customer@example.com',
    guestPhone: '+91 98765 43210',
    guests: 1,
    checkIn: '2025-04-10',
    checkOut: '2025-04-12',
    nights: 2,
    nightlyRate: 3200,
    gstPercent: calculateGSTRate(3200),
    taxAmount: 768,
    totalAmount: 7168,
    paymentMethod: 'CARD',
    status: 'CHECKED_OUT',
    createdAt: '2025-04-02T14:20:00Z',
  },
];

export function getAllBookings(): StoredBooking[] {
  if (typeof window === 'undefined') return DEFAULT_BOOKINGS;
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(DEFAULT_BOOKINGS));
      return DEFAULT_BOOKINGS;
    }
    return JSON.parse(raw) as StoredBooking[];
  } catch {
    return DEFAULT_BOOKINGS;
  }
}

export function getBookingByRef(ref: string): StoredBooking | undefined {
  const normalized = ref.toUpperCase();
  return getAllBookings().find((b) => b.bookingRef.toUpperCase() === normalized);
}

export function saveBookingRecord(booking: StoredBooking): void {
  if (typeof window === 'undefined') return;
  const existing = getAllBookings().filter((b) => b.bookingRef !== booking.bookingRef);
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify([booking, ...existing]));
}

export function cancelBookingRecord(bookingRef: string): StoredBooking[] {
  if (typeof window === 'undefined') return DEFAULT_BOOKINGS;
  const updated = getAllBookings().map((b) =>
    b.bookingRef === bookingRef ? { ...b, status: 'CANCELLED' as const } : b
  );
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getFavouriteSlugs(): string[] {
  if (typeof window === 'undefined') return ['the-grand-palace-hotel'];
  try {
    const raw = localStorage.getItem(FAVOURITES_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : ['the-grand-palace-hotel'];
  } catch {
    return ['the-grand-palace-hotel'];
  }
}

export function toggleFavouriteSlug(slug: string): string[] {
  const current = getFavouriteSlugs();
  const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
  if (typeof window !== 'undefined') {
    localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

export function downloadTextFile(filename: string, content: string, mimeType = 'text/plain;charset=utf-8') {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateGstInvoiceHtml(params: {
  invoiceNumber: string;
  bookingRef?: string;
  guestName: string;
  hotelName: string;
  hotelAddress?: string;
  totalAmount: number;
  taxAmount: number;
  date: string;
  status?: string;
}): string {
  const subtotal = Math.max(0, params.totalAmount - params.taxAmount);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>GST Tax Invoice - ${params.invoiceNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #1e293b; max-width: 720px; margin: 40px auto; padding: 24px; border: 1px solid #cbd5e1; border-radius: 12px; }
    h1 { margin: 0 0 4px; color: #b45309; }
    .meta { display: flex; justify-content: space-between; border-bottom: 2px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
    th, td { border-bottom: 1px solid #e2e8f0; padding: 10px; text-align: left; }
    th { background: #f8fafc; font-size: 12px; text-transform: uppercase; }
    .right { text-align: right; }
    .total { font-weight: bold; font-size: 16px; color: #0f172a; }
  </style>
</head>
<body>
  <h1>HOTEL OS — Official GST Tax Invoice</h1>
  <p style="font-size:12px;color:#64748b;margin-top:0;">GSTIN: 27AABCT2345Z1Z8 • SAC Code: 996311 (Hotel Accommodation)</p>
  <div class="meta">
    <div>
      <strong>Billed From:</strong><br/>
      ${params.hotelName}<br/>
      ${params.hotelAddress || 'Mumbai, Maharashtra, India'}
    </div>
    <div class="right">
      <strong>Invoice #:</strong> ${params.invoiceNumber}<br/>
      ${params.bookingRef ? `<strong>Booking Ref:</strong> ${params.bookingRef}<br/>` : ''}
      <strong>Guest:</strong> ${params.guestName}<br/>
      <strong>Date:</strong> ${params.date}<br/>
      <strong>Status:</strong> ${params.status || 'PAID'}
    </div>
  </div>
  <table>
    <thead>
      <tr><th>Description</th><th class="right">Amount (INR)</th></tr>
    </thead>
    <tbody>
      <tr><td>Accommodation & Hospitality Charges (Taxable Value)</td><td class="right">₹${subtotal.toLocaleString('en-IN')}</td></tr>
      <tr><td>Central + State GST (CGST + SGST)</td><td class="right">₹${params.taxAmount.toLocaleString('en-IN')}</td></tr>
      <tr class="total"><td>Total Invoice Value</td><td class="right">₹${params.totalAmount.toLocaleString('en-IN')}</td></tr>
    </tbody>
  </table>
  <p style="font-size:11px;color:#64748b;">Computer-generated tax invoice issued via Hotel OS Platform. No signature required.</p>
</body>
</html>`;
}

