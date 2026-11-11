// ─── @hotel-os/shared ────────────────────────────────────────────────────────
// Centralized enterprise types, constants, enums, validation schemas, and helpers
// ─────────────────────────────────────────────────────────────────────────────

export * from './i18n';


// ─── 1. USER & AUTH ENUMS & TYPES ───────────────────────────────────────────

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
  FINANCE_ADMIN = 'FINANCE_ADMIN',
  SUPPORT_AGENT = 'SUPPORT_AGENT',
  VERIFICATION_OFFICER = 'VERIFICATION_OFFICER',
  SECURITY_AUDITOR = 'SECURITY_AUDITOR',
  CUSTOMER = 'CUSTOMER',
  HOTEL_OWNER = 'HOTEL_OWNER',
  GENERAL_MANAGER = 'GENERAL_MANAGER',
  FRONT_DESK_MANAGER = 'FRONT_DESK_MANAGER',
  RECEPTIONIST = 'RECEPTIONIST',
  RESERVATION_MANAGER = 'RESERVATION_MANAGER',
  HOUSEKEEPING_MANAGER = 'HOUSEKEEPING_MANAGER',
  HOUSEKEEPING_STAFF = 'HOUSEKEEPING_STAFF',
  ACCOUNTANT = 'ACCOUNTANT',
  FINANCE_MANAGER = 'FINANCE_MANAGER',
  RESTAURANT_MANAGER = 'RESTAURANT_MANAGER',
  MAINTENANCE_STAFF = 'MAINTENANCE_STAFF',
  MARKETING_MANAGER = 'MARKETING_MANAGER',
  AUDITOR = 'AUDITOR',
}

export enum HotelStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

export enum HotelType {
  HOTEL = 'HOTEL',
  RESORT = 'RESORT',
  BOUTIQUE = 'BOUTIQUE',
  HOSTEL = 'HOSTEL',
  HOMESTAY = 'HOMESTAY',
  GUEST_HOUSE = 'GUEST_HOUSE',
  MOTEL = 'MOTEL',
  VILLA = 'VILLA',
  APARTMENT = 'APARTMENT',
  BED_AND_BREAKFAST = 'BED_AND_BREAKFAST',
}

export enum HotelRank {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND',
}

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  CLEANING_REQUIRED = 'CLEANING_REQUIRED',
  CLEANING_IN_PROGRESS = 'CLEANING_IN_PROGRESS',
  INSPECTED = 'INSPECTED',
  MAINTENANCE = 'MAINTENANCE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
}

export enum BookingStatus {
  INQUIRY = 'INQUIRY',
  PENDING = 'PENDING',
  AWAITING_PAYMENT = 'AWAITING_PAYMENT',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  REFUND_PENDING = 'REFUND_PENDING',
  REFUNDED = 'REFUNDED',
}

export enum BookingSource {
  WEBSITE = 'WEBSITE',
  WALK_IN = 'WALK_IN',
  PHONE = 'PHONE',
  OTA = 'OTA',
  CORPORATE = 'CORPORATE',
  AGENT = 'AGENT',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  UPI = 'UPI',
  CARD = 'CARD',
  NET_BANKING = 'NET_BANKING',
  WALLET = 'WALLET',
  PAYMENT_LINK = 'PAYMENT_LINK',
}

export enum HousekeepingStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  INSPECTED = 'INSPECTED',
}

export enum HousekeepingPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum HousekeepingTaskType {
  CHECKOUT_CLEAN = 'CHECKOUT_CLEAN',
  STAY_CLEAN = 'STAY_CLEAN',
  DEEP_CLEAN = 'DEEP_CLEAN',
  TURNDOWN = 'TURNDOWN',
  INSPECTION = 'INSPECTION',
}

export enum MaintenanceStatus {
  REPORTED = 'REPORTED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum SubscriptionPlan {
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  BUSINESS = 'BUSINESS',
  ENTERPRISE = 'ENTERPRISE',
}

export enum SubscriptionStatus {
  TRIAL = 'TRIAL',
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum LoyaltyTier {
  MEMBER = 'MEMBER',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
}

export enum LoyaltyTransactionType {
  EARN = 'EARN',
  REDEEM = 'REDEEM',
  EXPIRE = 'EXPIRE',
  ADJUST = 'ADJUST',
  BONUS = 'BONUS',
}

export enum NotificationType {
  BOOKING = 'BOOKING',
  PAYMENT = 'PAYMENT',
  CHECKIN = 'CHECKIN',
  CHECKOUT = 'CHECKOUT',
  HOUSEKEEPING = 'HOUSEKEEPING',
  MAINTENANCE = 'MAINTENANCE',
  SYSTEM = 'SYSTEM',
  SECURITY = 'SECURITY',
  SUBSCRIPTION = 'SUBSCRIPTION',
}

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  WHATSAPP = 'WHATSAPP',
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FLAGGED = 'FLAGGED',
}

// ─── 2. DOMAIN INTERFACES ────────────────────────────────────────────────────

export interface IUser {
  id: string;
  email: string;
  phone?: string | null;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  mfaEnabled: boolean;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IHotel {
  id: string;
  organizationId?: string | null;
  name: string;
  slug: string;
  type: HotelType;
  description: string;
  contactEmail: string;
  contactPhone: string;
  website?: string | null;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number | null;
  longitude?: number | null;
  starRating?: number | null;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicyHours: number;
  status: HotelStatus;
  rank: HotelRank;
  isVerified: boolean;
  isFeatured: boolean;
  totalRooms: number;
  totalFloors: number;
  amenities: string[];
  policies?: Record<string, any> | null;
  metadata?: Record<string, any> | null;
  timezone: string;
  currency: string;
  gstNumber?: string | null;
  panNumber?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IRoomCategory {
  id: string;
  hotelId: string;
  name: string;
  slug: string;
  description?: string | null;
  basePrice: number;
  maxOccupancy: number;
  extraPersonCharge: number;
  amenities: string[];
  images: string[];
  bedType: string;
  bedCount: number;
  roomSize?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface IRoom {
  id: string;
  hotelId: string;
  categoryId: string;
  roomNumber: string;
  floor: number;
  status: RoomStatus;
  description?: string | null;
  amenities: string[];
  images: string[];
  isActive: boolean;
  isSmokingAllowed: boolean;
  hasBalcony: boolean;
  hasSeaView: boolean;
  hasMountainView: boolean;
  notes?: string | null;
  lastCleanedAt?: string | Date | null;
  category?: IRoomCategory;
}

export interface IBooking {
  id: string;
  bookingRef: string;
  hotelId: string;
  userId?: string | null;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string | Date;
  checkOut: string | Date;
  adults: number;
  children: number;
  totalAmount: number;
  taxAmount: number;
  discountAmount: number;
  paidAmount: number;
  status: BookingStatus;
  source: BookingSource;
  specialRequests?: string | null;
  cancellationReason?: string | null;
  cancelledAt?: string | Date | null;
  checkedInAt?: string | Date | null;
  checkedInBy?: string | null;
  checkedOutAt?: string | Date | null;
  checkedOutBy?: string | null;
  idempotencyKey?: string | null;
  notes?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  hotel?: IHotel;
  bookingRooms?: Array<{
    id: string;
    roomId: string;
    pricePerNight: number;
    room?: IRoom;
  }>;
}

export interface IPayment {
  id: string;
  bookingId: string;
  hotelId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string | null;
  refundAmount?: number;
  refundReason?: string | null;
  refundedAt?: string | Date | null;
  createdAt: string | Date;
}

export interface IHousekeepingTask {
  id: string;
  hotelId: string;
  roomId: string;
  assignedTo?: string | null;
  status: HousekeepingStatus;
  priority: HousekeepingPriority;
  type: HousekeepingTaskType;
  checklist: Array<{ item: string; completed: boolean }>;
  notes?: string | null;
  startedAt?: string | Date | null;
  completedAt?: string | Date | null;
  inspectedBy?: string | null;
  inspectedAt?: string | Date | null;
  room?: IRoom;
  assignee?: IUser | null;
}

export interface IReview {
  id: string;
  hotelId: string;
  bookingId: string;
  userId: string;
  overallRating: number;
  cleanlinessRating: number;
  serviceRating: number;
  locationRating: number;
  valueRating: number;
  title: string;
  content: string;
  pros?: string | null;
  cons?: string | null;
  images: string[];
  status: ReviewStatus;
  hotelResponse?: string | null;
  respondedAt?: string | Date | null;
  isVerifiedStay: boolean;
  createdAt: string | Date;
  user?: {
    firstName: string;
    lastName: string;
    avatar?: string | null;
  };
}

export interface ILoyaltyAccount {
  id: string;
  userId: string;
  tier: LoyaltyTier;
  totalPoints: number;
  availablePoints: number;
  lifetimePoints: number;
  tierExpiresAt?: string | Date | null;
}

// ─── 3. API RESPONSE STANDARD ────────────────────────────────────────────────

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  cleaningRequiredRooms: number;
  maintenanceRooms: number;
  occupancyRate: number;
  todayArrivals: number;
  todayDepartures: number;
  todayRevenue: number;
  monthlyRevenue: number;
  averageDailyRate: number; // ADR
  revenuePerAvailableRoom: number; // RevPAR
  pendingHousekeepingTasks: number;
}

export interface AdminDashboardStats {
  totalHotels: number;
  approvedHotels: number;
  pendingHotels: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  activeSubscriptions: number;
  platformCommissions: number;
}

// ─── 4. CONSTANTS & GST RULES ────────────────────────────────────────────────

export const APP_NAME = 'HOTEL OS';
export const APP_VERSION = '0.1.0';
export const DEFAULT_CURRENCY = 'INR';

export const GST_SLABS = [
  { minRate: 0, maxRate: 1000, gstPercent: 0 },
  { minRate: 1001, maxRate: 7500, gstPercent: 12 },
  { minRate: 7501, maxRate: Infinity, gstPercent: 18 },
];

export function calculateGSTRate(roomPrice: number): number {
  for (const slab of GST_SLABS) {
    if (roomPrice >= slab.minRate && roomPrice <= slab.maxRate) {
      return slab.gstPercent;
    }
  }
  return 12;
}

export const COMMON_AMENITIES = [
  'Free High-Speed Wi-Fi',
  'Swimming Pool',
  'Air Conditioning',
  '24/7 Room Service',
  'Complimentary Breakfast',
  'Fitness Center / Gym',
  'Spa & Wellness',
  'Free Parking',
  'EV Charging Station',
  'Airport Shuttle',
  'Wheelchair Accessible',
  'Pet Friendly',
  'Restaurant & Bar',
  'Flat-Screen TV',
  'Mini Bar & Refrigerator',
  'Electric Kettle & Tea Kit',
  'In-room Safe',
  'Work Desk & Ergonomic Chair',
  'Hair Dryer & Iron',
  'Balcony with Scenic View',
];

export const HOTEL_ROLES_LIST = [
  UserRole.HOTEL_OWNER,
  UserRole.GENERAL_MANAGER,
  UserRole.FRONT_DESK_MANAGER,
  UserRole.RECEPTIONIST,
  UserRole.RESERVATION_MANAGER,
  UserRole.HOUSEKEEPING_MANAGER,
  UserRole.HOUSEKEEPING_STAFF,
  UserRole.ACCOUNTANT,
  UserRole.FINANCE_MANAGER,
  UserRole.RESTAURANT_MANAGER,
  UserRole.MAINTENANCE_STAFF,
  UserRole.MARKETING_MANAGER,
  UserRole.AUDITOR,
];

export const SUPER_ADMIN_ROLES = [
  UserRole.SUPER_ADMIN,
  UserRole.PLATFORM_ADMIN,
  UserRole.FINANCE_ADMIN,
  UserRole.SUPPORT_AGENT,
  UserRole.VERIFICATION_OFFICER,
  UserRole.SECURITY_AUDITOR,
];

// ─── 5. FORMATTING HELPERS ───────────────────────────────────────────────────

export function formatCurrency(amount: number, currency = 'INR'): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
}

export function formatDate(date: string | Date | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
