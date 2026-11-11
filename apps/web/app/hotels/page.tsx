'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  MapPin,
  Star,
  SlidersHorizontal,
  Wifi,
  Waves,
  Coffee,
  Car,
  ShieldCheck,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { api } from '../../src/lib/api';

interface HotelItem {
  id: string;
  name: string;
  slug: string;
  city: string;
  type: string;
  starRating: number;
  avgRating: number;
  totalReviews: number;
  minPrice: number;
  amenities: string[];
  description: string;
  isFeatured: boolean;
}

export default function HotelsListingPage() {
  const searchParams = useSearchParams();
  const initialCity = searchParams.get('city') || '';

  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState(initialCity);
  const [typeFilter, setTypeFilter] = useState('');
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [sortBy, setSortBy] = useState('recommended');

  const fallbackHotels: HotelItem[] = [
    {
      id: '1',
      name: 'The Grand Palace Hotel & Spa',
      slug: 'the-grand-palace-hotel',
      city: 'Mumbai',
      type: 'HOTEL',
      starRating: 5,
      avgRating: 4.9,
      totalReviews: 342,
      minPrice: 12500,
      amenities: ['Free High-Speed Wi-Fi', 'Swimming Pool', 'Spa & Wellness', '24/7 Room Service'],
      description: 'Ultra-luxurious 5-star heritage sanctuary overlooking the Arabian Sea in South Mumbai.',
      isFeatured: true,
    },
    {
      id: '2',
      name: 'Budget Inn Executive Mumbai',
      slug: 'budget-inn-executive',
      city: 'Mumbai',
      type: 'HOTEL',
      starRating: 3,
      avgRating: 4.4,
      totalReviews: 189,
      minPrice: 3200,
      amenities: ['Free High-Speed Wi-Fi', 'Air Conditioning', 'Free Parking'],
      description: 'Modern, clean corporate accommodation centrally connected to BKC financial district.',
      isFeatured: false,
    },
    {
      id: '3',
      name: 'Azure Palms Beach Resort & Villas',
      slug: 'azure-palms-resort',
      city: 'Goa',
      type: 'RESORT',
      starRating: 5,
      avgRating: 4.8,
      totalReviews: 512,
      minPrice: 9800,
      amenities: ['Swimming Pool', 'Spa & Wellness', 'Restaurant & Bar', 'Free High-Speed Wi-Fi'],
      description: 'Beachfront serenity with tropical gardens, private cabanas, and world-class culinary dining.',
      isFeatured: true,
    },
  ];

  useEffect(() => {
    async function fetchHotels() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (cityFilter) queryParams.set('city', cityFilter);
        if (typeFilter) queryParams.set('type', typeFilter);
        if (starFilter) queryParams.set('starRating', starFilter.toString());

        const res = await api.get<{ data: HotelItem[] }>(`/hotels?${queryParams.toString()}`);
        if (res && res.data && res.data.length > 0) {
          setHotels(res.data);
        } else {
          setHotels(fallbackHotels);
        }
      } catch (err) {
        // Fallback for seamless demo
        setHotels(fallbackHotels);
      } finally {
        setLoading(false);
      }
    }
    fetchHotels();
  }, [cityFilter, typeFilter, starFilter]);

  // Client-side filtering & sorting
  const filteredHotels = hotels
    .filter((h) => (maxPrice ? h.minPrice <= maxPrice : true))
    .sort((a, b) => {
      if (sortBy === 'priceAsc') return a.minPrice - b.minPrice;
      if (sortBy === 'priceDesc') return b.minPrice - a.minPrice;
      if (sortBy === 'rating') return b.avgRating - a.avgRating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb & Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Link href="/" className="hover:text-amber-600">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-600 font-medium">Hotels & Resorts</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {cityFilter ? `Hotels in ${cityFilter}` : 'All Properties & Resorts'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {filteredHotels.length} verified accommodations with real-time room availability
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm focus:outline-none"
          >
            <option value="recommended">Recommended & Featured</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="rating">Highest Guest Rating</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* ─── Filters Sidebar ──────────────────────────────────────────────── */}
        <aside className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Filter className="h-4 w-4 text-amber-600" />
              <span>Filter Results</span>
            </div>
            <button
              onClick={() => {
                setCityFilter('');
                setTypeFilter('');
                setStarFilter(null);
                setMaxPrice(20000);
              }}
              className="text-xs font-semibold text-amber-600 hover:underline"
            >
              Reset
            </button>
          </div>

          {/* City / Destination */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Destination City
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Mumbai', 'Goa', 'Delhi', 'Bengaluru'].map((c) => (
                <button
                  key={c}
                  onClick={() => setCityFilter(c === 'All' ? '' : c)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    (c === 'All' && !cityFilter) || cityFilter === c
                      ? 'bg-amber-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Star Category
            </label>
            <div className="flex flex-col gap-1.5">
              {[5, 4, 3].map((star) => (
                <button
                  key={star}
                  onClick={() => setStarFilter(starFilter === star ? null : star)}
                  className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs transition-colors ${
                    starFilter === star
                      ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {Array.from({ length: star }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    ))}
                    <span className="ml-1 font-medium">{star} Star</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Property Type
            </label>
            <div className="flex flex-col gap-1 text-xs">
              {[
                { label: 'All Types', value: '' },
                { label: 'Hotel', value: 'HOTEL' },
                { label: 'Resort', value: 'RESORT' },
                { label: 'Boutique', value: 'BOUTIQUE' },
              ].map((t) => (
                <label key={t.value} className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="radio"
                    name="propertyType"
                    checked={typeFilter === t.value}
                    onChange={() => setTypeFilter(t.value)}
                    className="accent-amber-600"
                  />
                  <span>{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Max Nightly Rate</span>
              <span className="text-amber-600 font-mono">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="2000"
              max="25000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
          </div>
        </aside>

        {/* ─── Hotels List ──────────────────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-48 animate-pulse rounded-2xl bg-slate-200" />
              ))}
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Search className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No properties found</h3>
              <p className="text-sm text-slate-500 mt-1">
                Try widening your price range or clearing destination filters.
              </p>
            </div>
          ) : (
            filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative sm:w-72 h-48 sm:h-auto shrink-0 bg-slate-100">
                  <img
                    src={
                      hotel.slug.includes('grand')
                        ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
                        : hotel.slug.includes('azure')
                        ? 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80'
                        : 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={hotel.name}
                    className="h-full w-full object-cover"
                  />
                  {hotel.isFeatured && (
                    <span className="absolute top-3 left-3 rounded-md bg-amber-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      Featured Stay
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-medium">{hotel.city}, India</span>
                        <span>•</span>
                        <span className="capitalize">{hotel.type.toLowerCase()}</span>
                      </div>
                      <div className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-800">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <span>{hotel.avgRating}</span>
                        <span className="text-slate-400 font-normal">({hotel.totalReviews})</span>
                      </div>
                    </div>

                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      {hotel.name}
                    </h2>
                    <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {hotel.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {hotel.amenities.slice(0, 4).map((a) => (
                        <span
                          key={a}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <span className="text-[11px] text-slate-400">Nightly rate from</span>
                      <div className="text-xl font-extrabold text-slate-900">
                        ₹{hotel.minPrice.toLocaleString('en-IN')}{' '}
                        <span className="text-xs font-normal text-slate-500">+ taxes</span>
                      </div>
                    </div>

                    <Link
                      href={`/hotels/${hotel.slug}`}
                      className="rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors"
                    >
                      Select Rooms
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

