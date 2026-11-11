'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  ShieldCheck,
  Zap,
  Sparkles,
  Building,
  CheckCircle,
  ArrowRight,
  Wifi,
  Coffee,
  Waves,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [destination, setDestination] = useState('Mumbai');
  const [checkIn, setCheckIn] = useState('2025-06-15');
  const [checkOut, setCheckOut] = useState('2025-06-18');
  const [guests, setGuests] = useState('2');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/hotels?city=${encodeURIComponent(destination)}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
    );
  };

  const featuredHotels = [
    {
      id: '1',
      name: 'The Grand Palace Hotel',
      slug: 'the-grand-palace-hotel',
      city: 'Mumbai',
      type: 'Luxury Hotel',
      starRating: 5,
      rating: 4.9,
      reviewsCount: 342,
      price: 12500,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      amenities: ['Pool', 'Spa', 'Fine Dining', 'Free Wi-Fi'],
    },
    {
      id: '2',
      name: 'Budget Inn Executive',
      slug: 'budget-inn-executive',
      city: 'Mumbai',
      type: 'Business Hotel',
      starRating: 3,
      rating: 4.4,
      reviewsCount: 189,
      price: 3200,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      amenities: ['Free Breakfast', 'Wi-Fi', '24/7 Desk', 'Metro Link'],
    },
    {
      id: '3',
      name: 'Azure Palms Beach Resort',
      slug: 'azure-palms-resort',
      city: 'Goa',
      type: 'Resort & Spa',
      starRating: 5,
      rating: 4.8,
      reviewsCount: 512,
      price: 9800,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      amenities: ['Private Beach', 'Infinity Pool', 'Cocktail Bar'],
    },
  ];

  return (
    <div className="flex flex-col">
      {/* ─── Hero Section with Live Search ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-900 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/30 via-slate-900 to-slate-950 -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next-Gen Enterprise Hospitality Operating System</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
              Discover Stays Designed for{' '}
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Exceptional Living
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-300">
              Direct-to-hotel booking with transparent GST pricing, instant mobile confirmation, and verified guest rewards.
            </p>
          </div>

          {/* Search Box Widget */}
          <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-slate-800 bg-white/10 p-3 shadow-2xl backdrop-blur-xl">
            <form
              onSubmit={handleSearch}
              className="grid grid-cols-1 gap-3 rounded-xl bg-white p-4 text-slate-900 shadow-md md:grid-cols-4 dark:bg-slate-900 dark:text-white"
            >
              {/* Destination */}
              <div className="flex flex-col gap-1 px-3 py-1 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-amber-600" /> Destination
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where are you going?"
                  className="w-full bg-transparent font-medium text-sm text-slate-900 focus:outline-none dark:text-white"
                />
              </div>

              {/* Check-in */}
              <div className="flex flex-col gap-1 px-3 py-1 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-amber-600" /> Check In
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-transparent font-medium text-sm text-slate-900 focus:outline-none dark:text-white"
                />
              </div>

              {/* Check-out */}
              <div className="flex flex-col gap-1 px-3 py-1 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-amber-600" /> Check Out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-transparent font-medium text-sm text-slate-900 focus:outline-none dark:text-white"
                />
              </div>

              {/* Guests + Submit Button */}
              <div className="flex items-center gap-2 px-3 py-1">
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-amber-600" /> Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-transparent font-medium text-sm text-slate-900 focus:outline-none dark:text-white"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4+ Guests</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600 text-white shadow-lg hover:bg-amber-700 transition-all hover:scale-105"
                  title="Search available rooms"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Quick city tags */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span>Popular destinations:</span>
            {['Mumbai', 'Goa', 'Bengaluru', 'Delhi', 'Jaipur'].map((city) => (
              <button
                key={city}
                onClick={() => setDestination(city)}
                className="rounded-full bg-slate-800/80 px-3 py-1 text-slate-300 hover:bg-amber-600 hover:text-white transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Fast Actions Banner: Self Check-In & Rewards ─────────────────── */}
      <section className="bg-slate-800 border-b border-slate-700/60 py-4 px-4 text-white">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <Link
              href="/check-in"
              className="flex items-center gap-2 hover:text-amber-400 font-bold transition-colors"
            >
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">⚡</span>
              <span>Express Contactless Self Check-In Portal</span>
            </Link>
            <Link
              href="/loyalty"
              className="flex items-center gap-2 hover:text-amber-400 font-bold transition-colors"
            >
              <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">🎁</span>
              <span>Earn 15% Rewards on Direct Bookings</span>
            </Link>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>🇮🇳 Indian DPDP Act 2025 Compliant</span>
            <span>•</span>
            <span>🧾 Automated GST Slabs (0%, 12%, 18%)</span>
          </div>
        </div>
      </section>

      {/* ─── Featured Hotels Section ───────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Handpicked Accommodations
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                Featured Properties & Resorts
              </h2>
            </div>
            <Link
              href="/hotels"
              className="mt-4 md:mt-0 flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700"
            >
              Browse all properties <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {featuredHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {hotel.type}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-amber-700 backdrop-blur-md shadow-sm">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span>{hotel.rating}</span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{hotel.city}, India</span>
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                    {hotel.name}
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {hotel.amenities.map((a) => (
                      <span
                        key={a}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {a}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div>
                      <span className="text-[11px] text-slate-400">Starting from</span>
                      <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                        ₹{hotel.price.toLocaleString('en-IN')}{' '}
                        <span className="text-xs font-normal text-slate-500">/ night</span>
                      </div>
                    </div>
                    <Link
                      href={`/hotels/${hotel.slug}`}
                      className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors"
                    >
                      View Rooms
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Platform Pillars / Features ───────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Architected for Performance
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
              The Hospitality OS Built on Zero-Trust Principles
            </h2>
            <p className="mt-4 text-slate-500">
              Unlike legacy booking portals, HOTEL OS unifies travelers, hotel operators, and platform administrators into one coordinated, real-time ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 mb-6">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Atomic Overlap Protection
              </h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Database-level transactional reservation engines prevent double bookings across simultaneous customer checkouts and front-desk walk-ins.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Multi-Tenant Isolation
              </h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Strict organization-level boundaries guarantee that financial reports, guest folios, and staff attendance are protected by server-enforced guards.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-400 mb-6">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                AI Revenue Management
              </h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Evaluated time-series predictive models compute 30-day occupancy projections and recommend surge or discount pricing based on live demand pace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Dual Portal CTA ───────────────────────────────────────────────── */}
      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold sm:text-3xl">Are you a Hotelier or Property Owner?</h3>
              <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                Upgrade from spreadsheets and fragmented tools to an all-in-one Property Management System (PMS), front-desk check-in board, housekeeping tracking, and dynamic pricing engine.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/hotel/onboarding"
                  className="rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-amber-700 transition-colors"
                >
                  Register Your Property Free
                </Link>
                <Link
                  href="/hotel/dashboard"
                  className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
                >
                  Explore B2B Live Demo
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-6 backdrop-blur">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                Quick Demo Credentials
              </div>
              <div className="space-y-2 text-xs font-mono text-slate-300">
                <p>👑 <strong>Super Admin:</strong> admin@hotel-os.dev / HotelOS@2024</p>
                <p>🏨 <strong>Hotel Owner:</strong> owner@demo-hotel.com / Demo@2024</p>
                <p>👤 <strong>Guest Customer:</strong> customer@example.com / Customer@2024</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700 flex justify-end">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  One-click demo sign in <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

