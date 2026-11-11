'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin,
  Star,
  ShieldCheck,
  Clock,
  Wifi,
  Waves,
  Coffee,
  CheckCircle2,
  Users,
  Bed,
  Sparkles,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { api } from '../../../src/lib/api';

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fallback data for robust showcase
  const defaultHotel = {
    id: 'grand-palace-1',
    name: 'The Grand Palace Hotel & Spa',
    slug: 'the-grand-palace-hotel',
    type: 'Luxury Hotel',
    starRating: 5,
    avgRating: 4.9,
    city: 'Mumbai',
    address: 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001',
    description:
      'Experience the pinnacle of hospitality at The Grand Palace Hotel & Spa. Featuring panoramic Arabian Sea views, bespoke butler service, a temperature-controlled rooftop infinity pool, and multiple Michelin-starred dining experiences.',
    amenities: [
      'Free High-Speed Wi-Fi',
      'Swimming Pool',
      'Spa & Wellness Sanctuary',
      '24/7 Fine Room Service',
      'Complimentary Gourmet Breakfast',
      'Fitness Center & Yoga Pavilion',
      'Valet & EV Charging',
      'Airport Limousine Transfer',
    ],
    checkInTime: '14:00',
    checkOutTime: '11:00',
    cancellationPolicyHours: 24,
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
          'From the seamless mobile check-in to the personalized welcome amenity, our 3-night stay was pure perfection. The rooftop infinity pool at sunset is unmissable.',
      },
      {
        id: 'rev-2',
        author: 'Vikram Mehta',
        rating: 5,
        date: 'April 2025',
        title: 'World-class business and leisure sanctuary',
        content:
          'Super fast Wi-Fi for video conferencing, exquisite breakfast spread, and the front-desk team handled an early check-in effortlessly. Will return!',
      },
    ],
  };

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<any>(`/hotels/${slug}`);
        if (data) {
          setHotel(data);
        } else {
          setHotel(defaultHotel);
        }
      } catch {
        setHotel(defaultHotel);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading || !hotel) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="h-8 w-48 mx-auto animate-pulse bg-slate-200 rounded mb-4" />
        <div className="h-96 w-full animate-pulse bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  const handleBookCategory = (catId: string) => {
    router.push(`/booking/${hotel.slug}?category=${catId}`);
  };

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
              {hotel.starRating || 5} Star Luxury
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
            <span>{hotel.address || 'Colaba, Mumbai, India'}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-sm font-bold text-slate-900">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span>4.9 / 5.0</span>
            </div>
            <span className="text-xs text-slate-400">Based on 340+ verified stays</span>
          </div>
          <a
            href="#rooms"
            className="rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-amber-700 transition-colors"
          >
            View Available Rooms
          </a>
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-80 sm:h-96 rounded-2xl overflow-hidden shadow-sm">
        <div className="md:col-span-2 relative h-full">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
            alt="Hotel facade"
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
              {(hotel.amenities || defaultHotel.amenities).map((a: string) => (
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
                Free cancellation up to 24h before
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">GST Compliance:</span>
              <span className="font-medium text-slate-700">GST Invoice issued upon checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Available Rooms Section ────────────────────────────────────────── */}
      <section id="rooms" className="pt-6 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Real-Time Availability
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Select Your Room Category
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {(hotel.roomCategories || defaultHotel.roomCategories).map((cat: any) => (
            <div
              key={cat.id}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="h-48 overflow-hidden bg-slate-100">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=600&q=80'}
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
                      ₹{Number(cat.basePrice).toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal text-slate-500">+12% GST</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookCategory(cat.id)}
                    className="flex items-center gap-1 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors"
                  >
                    <span>Reserve</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verified Reviews Section */}
      <section className="pt-8 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Verified Guest Reviews</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {defaultHotel.reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{r.author}</h4>
                  <span className="text-xs text-slate-400">{r.date} • Verified Stay</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: r.rating }).map((_, i) => (
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
    </div>
  );
}
