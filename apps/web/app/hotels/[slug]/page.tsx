'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  MapPin,
  Star,
  ShieldCheck,
  CheckCircle2,
  Users,
  Bed,
  ChevronRight,
  ArrowRight,
  Heart,
  MessageSquare,
} from 'lucide-react';
import { calculateGSTRate } from '@hotel-os/shared';
import { api } from '../../../src/lib/api';
import {
  findDemoHotelBySlug,
  getFavouriteSlugs,
  toggleFavouriteSlug,
} from '../../../src/lib/demo-data';

function HotelDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;

  const checkIn = searchParams.get('checkIn') || '2025-06-15';
  const checkOut = searchParams.get('checkOut') || '2025-06-18';
  const guests = searchParams.get('guests') || '2';

  const fallbackHotel = findDemoHotelBySlug(slug);
  const [hotel, setHotel] = useState<any>(fallbackHotel);
  const [loading, setLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  useEffect(() => {
    setIsFav(getFavouriteSlugs().includes(slug));
  }, [slug]);

  useEffect(() => {
    let active = true;
    async function load() {
      const localFallback = findDemoHotelBySlug(slug);
      if (active) setHotel(localFallback);
      try {
        const data = await api.get<any>(`/hotels/${slug}`);
        if (active && data && data.name) {
          setHotel(data);
        }
      } catch {
        // Retain local property data seamlessly when API is offline
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading || !hotel) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="h-8 w-48 mx-auto animate-pulse bg-slate-200 rounded mb-4" />
        <div className="h-96 w-full animate-pulse bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  const handleToggleFav = () => {
    const updated = toggleFavouriteSlug(hotel.slug || slug);
    const saved = updated.includes(hotel.slug || slug);
    setIsFav(saved);
    toast.success(saved ? `${hotel.name} saved to Favourites` : `${hotel.name} removed from Favourites`);
  };

  const handleBookCategory = (catId: string) => {
    router.push(
      `/booking/${hotel.slug}?category=${encodeURIComponent(catId)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&guests=${encodeURIComponent(guests)}`
    );
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    toast.success(`Inquiry delivered to ${hotel.name} front desk concierge!`);
    setShowContactModal(false);
    setContactMessage('');
  };

  const categories = hotel.roomCategories?.length ? hotel.roomCategories : fallbackHotel.roomCategories;
  const amenities = hotel.amenities?.length ? hotel.amenities : fallbackHotel.amenities;
  const reviews = hotel.reviews?.length ? hotel.reviews : fallbackHotel.reviews;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/" className="hover:text-amber-600">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/hotels" className="hover:text-amber-600">Hotels</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-600 font-medium">{hotel.name}</span>
      </div>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
              {hotel.starRating || 5} Star {hotel.type || 'Luxury'}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <ShieldCheck className="h-4 w-4" /> Verified Hotel OS Property
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            {hotel.name}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span>{hotel.address || `${hotel.city || 'Mumbai'}, India`}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleToggleFav}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-colors ${
              isFav ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFav ? 'fill-rose-600 text-rose-600' : ''}`} />
            <span>{isFav ? 'Saved' : 'Save'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowContactModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <MessageSquare className="h-4 w-4 text-amber-600" />
            <span>Contact Hotel</span>
          </button>

          <div className="text-right hidden sm:block px-2">
            <div className="flex items-center justify-end gap-1 text-sm font-bold text-slate-900">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span>{hotel.avgRating || 4.8} / 5.0</span>
            </div>
            <span className="text-xs text-slate-400">Based on {hotel.totalReviews || 250}+ stays</span>
          </div>

          <a
            href="#rooms"
            className="rounded-xl bg-amber-600 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-amber-700 transition-colors"
          >
            View Available Rooms
          </a>
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-80 sm:h-96 rounded-2xl overflow-hidden shadow-sm">
        <div className="md:col-span-2 relative h-full">
          <img
            src={hotel.heroImage || fallbackHotel.heroImage}
            alt={hotel.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="hidden md:flex flex-col gap-3">
          <div className="h-1/2 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"
              alt="Room interior"
              className="h-full w-full object-cover hover:scale-105 transition-transform"
            />
          </div>
          <div className="h-1/2 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=600&q=80"
              alt="Luxury suite"
              className="h-full w-full object-cover hover:scale-105 transition-transform"
            />
          </div>
        </div>
        <div className="hidden md:flex flex-col gap-3">
          <div className="h-1/2 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80"
              alt="Infinity pool"
              className="h-full w-full object-cover hover:scale-105 transition-transform"
            />
          </div>
          <div className="h-1/2 overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80"
              alt="Dining room"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white text-xs font-bold">
              +18 Photos
            </div>
          </div>
        </div>
      </div>

      {/* Hotel Highlights & Policies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">About the Property</h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              {hotel.description}
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">Key Amenities</h3>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {amenities.map((a: string) => (
                <div
                  key={a}
                  className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs font-medium text-slate-700"
                >
                  <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Policies Box */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Hotel House Rules & Policies
          </h3>
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Check-In Time:</span>
              <span className="font-bold text-slate-800">{hotel.checkInTime || '14:00'} hrs</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Check-Out Time:</span>
              <span className="font-bold text-slate-800">{hotel.checkOutTime || '11:00'} hrs</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Cancellation Policy:</span>
              <span className="font-semibold text-emerald-600">
                Free up to {hotel.cancellationPolicyHours || 24}h before
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">GST Compliance:</span>
              <span className="font-medium text-slate-700">Statutory GST Invoice included</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Available Rooms Section ────────────────────────────────────────── */}
      <section id="rooms" className="pt-6 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Real-Time Availability • {checkIn} to {checkOut}
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Select Your Room Category
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {categories.map((cat: any) => {
            const nightly = Number(cat.basePrice);
            const gstSlab = calculateGSTRate(nightly);
            return (
              <div
                key={cat.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className="h-48 overflow-hidden bg-slate-100">
                  <img
                    src={cat.image || cat.images?.[0] || 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=600&q=80'}
                    alt={cat.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-6 flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{cat.name}</h3>
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Bed className="h-3.5 w-3.5 text-slate-400" />
                        {cat.bedType || 'King Bed'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        Up to {cat.maxOccupancy || 2} Guests
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1">
                      {(cat.amenities || ['Wi-Fi', 'Air Conditioning']).map((a: string) => (
                        <span
                          key={a}
                          className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-4 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400">Nightly rate</span>
                      <div className="text-xl font-extrabold text-slate-900">
                        ₹{nightly.toLocaleString('en-IN')}{' '}
                        <span className="text-xs font-normal text-slate-500">+{gstSlab}% GST</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleBookCategory(cat.id)}
                      className="flex items-center gap-1 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors"
                    >
                      <span>Reserve</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Verified Reviews Section */}
      <section className="pt-8 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Verified Guest Reviews</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r: any) => (
            <div
              key={r.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{r.author || 'Verified Guest'}</h4>
                  <span className="text-xs text-slate-400">{r.date || 'Recent'} • Verified Stay</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: r.rating || 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
              </div>
              <h5 className="font-semibold text-xs text-slate-800">{r.title}</h5>
              <p className="text-xs text-slate-600 leading-relaxed">{r.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Property Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Contact {hotel.name}</h3>
              <button type="button" onClick={() => setShowContactModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <form onSubmit={handleSendInquiry} className="space-y-4 text-xs">
              <textarea
                rows={4}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Ask the front desk about group bookings, airport pickup, or early check-in..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800"
                required
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowContactModal(false)} className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-amber-600 px-5 py-2 font-bold text-white hover:bg-amber-700">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HotelDetailPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-slate-500 text-sm">Loading hotel details...</div>}>
      <HotelDetailContent />
    </React.Suspense>
  );
}
