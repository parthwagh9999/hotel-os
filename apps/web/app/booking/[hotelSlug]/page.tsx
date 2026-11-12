'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Calendar,
  Users,
  CreditCard,
  QrCode,
  Building,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { calculateGSTRate } from '@hotel-os/shared';
import { api } from '../../../src/lib/api';
import { DEMO_HOTELS, findDemoHotelBySlug, saveBookingRecord } from '../../../src/lib/demo-data';

function BookingCheckoutContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hotelSlug = (params?.hotelSlug as string) || 'the-grand-palace-hotel';

  const [hotel, setHotel] = useState(() => DEMO_HOTELS.find((h) => h.slug === hotelSlug) || DEMO_HOTELS[0]);
  useEffect(() => {
    setHotel(findDemoHotelBySlug(hotelSlug));
  }, [hotelSlug]);
  const categoryId = searchParams.get('category');
  const selectedCategory =
    hotel.roomCategories.find((c) => c.id === categoryId) || hotel.roomCategories[0];

  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '2025-06-15');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '2025-06-18');
  const [guests, setGuests] = useState(Number(searchParams.get('guests')) || 2);
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [email, setEmail] = useState('customer@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [specialRequests, setSpecialRequests] = useState('Quiet room on high floor');
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI' | 'CASH'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute stay duration and statutory Indian GST slab dynamically
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const isDateRangeValid = outDate > inDate;
  const nights = isDateRangeValid
    ? Math.max(1, Math.ceil((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 1;

  const nightlyRate = selectedCategory.basePrice;
  const subtotal = nightlyRate * nights;
  const gstPercent = calculateGSTRate(nightlyRate);
  const taxAmount = Math.round((subtotal * gstPercent) / 100);
  const totalAmount = subtotal + taxAmount;

  const persistDemoAndNavigate = (bookingRef: string) => {
    saveBookingRecord({
      bookingRef,
      hotelSlug: hotel.slug,
      hotelName: hotel.name,
      hotelAddress: hotel.address,
      city: hotel.city,
      categoryName: selectedCategory.name,
      guestName: `${firstName} ${lastName}`.trim(),
      guestEmail: email,
      guestPhone: phone,
      guests,
      checkIn,
      checkOut,
      nights,
      nightlyRate,
      gstPercent,
      taxAmount,
      totalAmount,
      paymentMethod,
      specialRequests,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    });
    toast.success(`Reservation ${bookingRef} confirmed!`);
    router.push(`/booking/confirmation/${bookingRef}`);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDateRangeValid) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        hotelId: hotel.id,
        roomId: selectedCategory.id,
        checkInDate: `${checkIn}T14:00:00Z`,
        checkOutDate: `${checkOut}T11:00:00Z`,
        guests,
        guestInfo: {
          firstName,
          lastName,
          email,
          phone,
        },
        specialRequests,
        idempotencyKey: `idemp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      };

      const res = await api.post<any>('/bookings', bookingData);
      const bookingRef =
        res?.bookingRef || `HOS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      if (res?.id) {
        await api.post(`/bookings/${res.id}/pay`, {
          method: paymentMethod,
          transactionId: `TXN-${Date.now()}`,
        });
      }

      persistDemoAndNavigate(bookingRef);
    } catch {
      const fallbackRef = `HOS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      persistDemoAndNavigate(fallbackRef);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
        <Link href="/" className="hover:text-amber-600">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/hotels/${hotel.slug}`} className="hover:text-amber-600">{hotel.name}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-600 font-medium">Checkout & Reservation</span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ─── Form Inputs ──────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSubmitBooking} className="space-y-8">
            {/* Step 1: Stay Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Calendar className="h-4 w-4 text-amber-600" />
                <h2 className="text-base font-bold text-slate-900">1. Reservation Dates & Guests</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500">Check-in Date</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Check-out Date</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Total Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="1">1 Adult</option>
                    <option value="2">2 Adults</option>
                    <option value="3">3 Adults</option>
                    <option value="4">4 Adults</option>
                  </select>
                </div>
              </div>

              {!isDateRangeValid && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700">
                  Check-out date must be later than check-in date.
                </div>
              )}
            </div>

            {/* Step 2: Guest Profile */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Users className="h-4 w-4 text-amber-600" />
                <h2 className="text-base font-bold text-slate-900">2. Primary Guest Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Email Address (for Invoice & Confirmation)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Phone Number (WhatsApp Updates)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">Special Requests</label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g. early check-in, ground floor room, airport pickup assistance"
                />
              </div>
            </div>

            {/* Step 3: Payment Options */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <CreditCard className="h-4 w-4 text-amber-600" />
                <h2 className="text-base font-bold text-slate-900">3. Select Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'UPI', title: 'UPI Instant', desc: 'Google Pay / PhonePe / QR', icon: QrCode },
                  { id: 'CARD', title: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard },
                  { id: 'CASH', title: 'Pay at Hotel', desc: 'Settle during Check-In', icon: Building },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-500/20'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isSelected ? 'text-amber-600' : 'text-slate-500'}`} />
                      <span className="mt-2 text-xs font-bold text-slate-900">{m.title}</span>
                      <span className="text-[11px] text-slate-500 mt-0.5">{m.desc}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Lock className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  Payments encrypted via PCI-DSS compliant sandbox tokenization. No raw card numbers stored.
                </span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting || !isDateRangeValid}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-600 py-4 text-sm font-bold text-white shadow-lg hover:bg-amber-700 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Confirming atomic room reservation...</span>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Confirm Reservation & Pay ₹{totalAmount.toLocaleString('en-IN')}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* ─── Folio & Price Breakdown Sidebar ──────────────────────────────── */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                Reservation Summary
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {hotel.name}
              </h3>
              <p className="text-xs text-slate-500">{hotel.address}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between font-medium">
                <span>Room Type:</span>
                <span className="font-bold text-slate-900">{selectedCategory.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-in:</span>
                <span>{checkIn} ({hotel.checkInTime} hrs)</span>
              </div>
              <div className="flex justify-between">
                <span>Check-out:</span>
                <span>{checkOut} ({hotel.checkOutTime} hrs)</span>
              </div>
              <div className="flex justify-between font-semibold text-amber-800">
                <span>Length of Stay:</span>
                <span>{nights} Night{nights > 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-4 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Room Base (₹{nightlyRate.toLocaleString('en-IN')} × {nights} nights):</span>
                <span className="font-medium text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax ({gstPercent}% Government Slab):</span>
                <span className="font-medium text-slate-900">₹{taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Loyalty Welcome Points:</span>
                <span className="font-semibold">+{Math.round((subtotal / 100) * 10 * 1.15)} Points</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-sm font-extrabold text-slate-900">
                <span>Total Amount Due:</span>
                <span className="text-xl text-amber-600">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="rounded-xl bg-emerald-50 border border-emerald-200/50 p-3 flex items-start gap-2 text-xs text-emerald-800">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>Free cancellation up to {hotel.cancellationPolicyHours} hours prior to check-in. Instant automated refund.</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function BookingCheckoutPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-slate-500 text-sm">Loading checkout...</div>}>
      <BookingCheckoutContent />
    </React.Suspense>
  );
}
