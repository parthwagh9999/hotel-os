'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  CalendarCheck,
  Download,
  Heart,
  Star,
  XCircle,
  MessageSquare,
  KeyRound,
  Building2,
  MapPin,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import {
  DEMO_HOTELS,
  StoredBooking,
  getAllBookings,
  cancelBookingRecord,
  getFavouriteSlugs,
  toggleFavouriteSlug,
  downloadTextFile,
  generateGstInvoiceHtml,
} from '../../src/lib/demo-data';
import { api } from '../../src/lib/api';

export default function CustomerReservationsPage() {
  const [bookings, setBookings] = useState<StoredBooking[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST' | 'FAVOURITES'>('UPCOMING');

  // Review Modal State
  const [reviewBooking, setReviewBooking] = useState<StoredBooking | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewedRefs, setReviewedRefs] = useState<string[]>([]);

  // Contact Hotel Modal State
  const [contactBooking, setContactBooking] = useState<StoredBooking | null>(null);
  const [contactMsg, setContactMsg] = useState('');

  useEffect(() => {
    setBookings(getAllBookings());
    setFavourites(getFavouriteSlugs());
  }, []);

  const handleCancelBooking = async (bookingRef: string) => {
    const updated = cancelBookingRecord(bookingRef);
    setBookings(updated);
    toast.success(`Reservation ${bookingRef} cancelled. Full refund initiated per 24h free cancellation policy.`);

    try {
      await api.post(`/bookings/${bookingRef}/cancel`, { reason: 'Guest cancelled online' });
    } catch {
      // Seamless local demo persistence
    }
  };

  const handleDownloadInvoice = (b: StoredBooking) => {
    const html = generateGstInvoiceHtml({
      invoiceNumber: `INV-${b.bookingRef}`,
      bookingRef: b.bookingRef,
      guestName: b.guestName,
      hotelName: b.hotelName,
      hotelAddress: b.hotelAddress,
      totalAmount: b.totalAmount,
      taxAmount: b.taxAmount,
      date: b.checkOut,
      status: b.status === 'CANCELLED' ? 'REFUNDED' : 'PAID',
    });
    downloadTextFile(`Invoice-${b.bookingRef}.html`, html, 'text/html;charset=utf-8');
    toast.success(`Official GST Invoice downloaded for ${b.bookingRef}`);
  };

  const handleToggleFav = (slug: string) => {
    const updated = toggleFavouriteSlug(slug);
    setFavourites(updated);
    toast.success(
      updated.includes(slug) ? 'Property added to Favourites' : 'Property removed from Favourites'
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking) return;
    setReviewedRefs([...reviewedRefs, reviewBooking.bookingRef]);
    toast.success(`Thank you! Your ${rating}-star review for ${reviewBooking.hotelName} has been published.`);
    setReviewBooking(null);
    setReviewTitle('');
    setReviewComment('');
  };

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactBooking || !contactMsg.trim()) return;
    toast.success(`Message dispatched to ${contactBooking.hotelName} concierge! Typical reply < 15 mins.`);
    setContactBooking(null);
    setContactMsg('');
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'CONFIRMED' || b.status === 'CHECKED_IN'
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'CHECKED_OUT' || b.status === 'CANCELLED'
  );
  const favouriteHotels = DEMO_HOTELS.filter((h) => favourites.includes(h.slug));

  const visibleBookings = activeTab === 'UPCOMING' ? upcomingBookings : pastBookings;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Traveler Portal (B2C)
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl mt-1">
            My Reservations, Invoices & Saved Hotels
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage upcoming stays, complete express self check-in, download GST invoices, and rate past stays.
          </p>
        </div>

        <Link
          href="/hotels"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition-colors shrink-0"
        >
          <Building2 className="h-4 w-4" />
          <span>Book New Stay</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs sm:text-sm font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('UPCOMING')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'UPCOMING'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Upcoming Stays ({upcomingBookings.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('PAST')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'PAST'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Past & Cancelled ({pastBookings.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('FAVOURITES')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'FAVOURITES'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className="h-3.5 w-3.5 text-rose-500" />
          <span>Saved Favourites ({favouriteHotels.length})</span>
        </button>
      </div>

      {/* Bookings List */}
      {activeTab !== 'FAVOURITES' ? (
        <div className="space-y-4">
          {visibleBookings.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
              <CalendarCheck className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="text-base font-bold text-slate-800">No reservations in this view</h3>
              <p className="text-xs text-slate-500">Ready for your next trip? Browse curated hotels and resorts.</p>
              <Link
                href="/hotels"
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white"
              >
                Explore Properties <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            visibleBookings.map((b) => (
              <div
                key={b.bookingRef}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col lg:flex-row justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-md">
                      {b.bookingRef}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {b.status}
                    </span>
                    <span className="text-xs text-slate-400">• {b.paymentMethod}</span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900">{b.hotelName}</h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      {b.categoryName} • {b.checkIn} to {b.checkOut} ({b.nights} Nights, {b.guests} Guests)
                    </span>
                  </p>
                  <div className="text-sm font-extrabold text-slate-900 pt-1">
                    Total Paid: ₹{b.totalAmount.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-slate-400">
                      (incl. {b.gstPercent}% GST)
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                  {b.status === 'CONFIRMED' && (
                    <>
                      <Link
                        href={`/check-in/${b.bookingRef}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                      >
                        <KeyRound className="h-3.5 w-3.5" /> Self Check-In
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleCancelBooking(b.bookingRef)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-700 hover:bg-red-100"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Cancel Stay
                      </button>
                    </>
                  )}

                  {b.status === 'CHECKED_OUT' && !reviewedRefs.includes(b.bookingRef) && (
                    <button
                      type="button"
                      onClick={() => setReviewBooking(b)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-700"
                    >
                      <Star className="h-3.5 w-3.5" /> Write Review
                    </button>
                  )}

                  {reviewedRefs.includes(b.bookingRef) && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 px-2">
                      <CheckCircle2 className="h-4 w-4" /> Review Submitted
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setContactBooking(b)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Contact Hotel
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadInvoice(b)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Download className="h-3.5 w-3.5 text-amber-600" /> GST Invoice
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Saved Favourites Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favouriteHotels.length === 0 ? (
            <div className="md:col-span-3 rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
              <Heart className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="text-base font-bold text-slate-800">No saved favourite hotels yet</h3>
              <Link
                href="/hotels"
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white"
              >
                Browse Hotels
              </Link>
            </div>
          ) : (
            favouriteHotels.map((hotel) => (
              <div key={hotel.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  <div className="h-44 relative bg-slate-100">
                    <img src={hotel.heroImage} alt={hotel.name} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleToggleFav(hotel.slug)}
                      className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 text-rose-600 flex items-center justify-center shadow"
                      aria-label={`Remove ${hotel.name} from favourites`}
                    >
                      <Heart className="h-4 w-4 fill-rose-600" />
                    </button>
                  </div>
                  <div className="p-5">
                    <span className="text-[11px] font-semibold text-slate-400">{hotel.city}, India</span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{hotel.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{hotel.description}</p>
                  </div>
                </div>
                <div className="px-5 pb-5 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-sm font-extrabold text-slate-900">
                    ₹{hotel.minPrice.toLocaleString('en-IN')}/night
                  </span>
                  <Link
                    href={`/hotels/${hotel.slug}`}
                    className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700"
                  >
                    View Rooms
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Review Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Rate Your Stay at {reviewBooking.hotelName}</h3>
              <button type="button" onClick={() => setReviewBooking(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-2">Star Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className={`p-2 rounded-lg border ${
                        rating >= n ? 'border-amber-400 bg-amber-50 text-amber-500' : 'border-slate-200 text-slate-300'
                      }`}
                    >
                      <Star className={`h-5 w-5 ${rating >= n ? 'fill-amber-500' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Review Title</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Outstanding hospitality and clean rooms"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Detailed Feedback</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share highlights of cleanliness, check-in speed, and dining..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setReviewBooking(null)} className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-amber-600 px-5 py-2 font-bold text-white hover:bg-amber-700">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Hotel Modal */}
      {contactBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Message {contactBooking.hotelName}</h3>
              <button type="button" onClick={() => setContactBooking(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSendContact} className="space-y-4 text-xs">
              <p className="text-slate-500">
                Reference: <strong className="font-mono text-slate-800">{contactBooking.bookingRef}</strong>
              </p>
              <textarea
                rows={4}
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                placeholder="Ask about early check-in, airport pickup, or room preferences..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800"
                required
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setContactBooking(null)} className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-amber-600 px-5 py-2 font-bold text-white hover:bg-amber-700">
                  Send to Front Desk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

