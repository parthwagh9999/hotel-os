'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  Search,
  MapPin,
  Star,
  ChevronRight,
  Filter,
  Heart,
  Scale,
  X,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../src/lib/api';
import {
  DEMO_HOTELS,
  getApprovedHotels,
  getFavouriteSlugs,
  toggleFavouriteSlug,
} from '../../src/lib/demo-data';

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
  heroImage?: string;
}

const FALLBACK_HOTELS: HotelItem[] = DEMO_HOTELS.map((h) => ({
  id: h.id,
  name: h.name,
  slug: h.slug,
  city: h.city,
  type: h.type,
  starRating: h.starRating,
  avgRating: h.avgRating,
  totalReviews: h.totalReviews,
  minPrice: h.minPrice,
  amenities: h.amenities,
  description: h.description,
  isFeatured: h.isFeatured,
  heroImage: h.heroImage,
}));

function HotelsListingContent() {
  const searchParams = useSearchParams();
  const initialCity = searchParams.get('city') || '';
  const checkIn = searchParams.get('checkIn') || '2025-06-15';
  const checkOut = searchParams.get('checkOut') || '2025-06-18';
  const guests = searchParams.get('guests') || '2';

  const [hotels, setHotels] = useState<HotelItem[]>(FALLBACK_HOTELS);
  const [loading, setLoading] = useState(false);
  const [cityFilter, setCityFilter] = useState(initialCity);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(25000);
  const [sortBy, setSortBy] = useState('recommended');

  const [favourites, setFavourites] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    setFavourites(getFavouriteSlugs());
    setHotels(
      getApprovedHotels().map((h) => ({
        id: h.id,
        name: h.name,
        slug: h.slug,
        city: h.city,
        type: h.type,
        starRating: h.starRating,
        avgRating: h.avgRating,
        totalReviews: h.totalReviews,
        minPrice: h.minPrice,
        amenities: h.amenities,
        description: h.description,
        isFeatured: h.isFeatured,
        heroImage: h.heroImage,
      }))
    );
  }, []);

  useEffect(() => {
    let active = true;
    async function fetchHotels() {
      try {
        const queryParams = new URLSearchParams();
        if (cityFilter) queryParams.set('city', cityFilter);
        if (typeFilter) queryParams.set('type', typeFilter);
        if (starFilter) queryParams.set('starRating', starFilter.toString());

        const res = await api.get<{ data: HotelItem[] }>(`/hotels?${queryParams.toString()}`);
        if (active && res && res.data && res.data.length > 0) {
          setHotels(res.data);
        }
      } catch {
        // Keep instant client catalog when API is offline
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchHotels();
    return () => {
      active = false;
    };
  }, [cityFilter, typeFilter, starFilter]);

  const handleToggleFavourite = (slug: string) => {
    const updated = toggleFavouriteSlug(slug);
    setFavourites(updated);
    toast.success(updated.includes(slug) ? 'Saved to Favourites' : 'Removed from Favourites');
  };

  const handleToggleCompare = (slug: string) => {
    if (compareList.includes(slug)) {
      setCompareList(compareList.filter((s) => s !== slug));
    } else if (compareList.length >= 3) {
      toast.error('You can compare up to 3 properties at once');
    } else {
      setCompareList([...compareList, slug]);
    }
  };

  // Full client-side filtering & sorting (works cleanly offline too!)
  const filteredHotels = hotels
    .filter((h) => {
      if (cityFilter && !h.city.toLowerCase().includes(cityFilter.toLowerCase())) return false;
      if (typeFilter && h.type.toUpperCase() !== typeFilter.toUpperCase()) return false;
      if (starFilter && h.starRating < starFilter) return false;
      if (maxPrice && h.minPrice > maxPrice) return false;
      if (
        searchQuery &&
        !`${h.name} ${h.city} ${h.description}`.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priceAsc') return a.minPrice - b.minPrice;
      if (sortBy === 'priceDesc') return b.minPrice - a.minPrice;
      if (sortBy === 'rating') return b.avgRating - a.avgRating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });

  const comparedProperties = hotels.filter((h) => compareList.includes(h.slug));
  const detailQuery = `?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&guests=${encodeURIComponent(guests)}`;

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
            Showing {filteredHotels.length} verified accommodations • {checkIn} to {checkOut} ({guests} Guests)
          </p>
        </div>

        {/* Sort & Compare Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {compareList.length > 0 && (
            <button
              type="button"
              onClick={() => setShowCompareModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800"
            >
              <Scale className="h-3.5 w-3.5 text-amber-400" />
              <span>Compare ({compareList.length})</span>
            </button>
          )}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-hotels" className="text-xs font-semibold text-slate-500">Sort by:</label>
            <select
              id="sort-hotels"
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
              type="button"
              onClick={() => {
                setCityFilter('');
                setSearchQuery('');
                setTypeFilter('');
                setStarFilter(null);
                setMaxPrice(25000);
                setSortBy('recommended');
              }}
              className="text-xs font-semibold text-amber-600 hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Keyword search */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Search Name / Area
            </label>
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Palace, Colaba, Spa"
                className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-600"
              />
            </div>
          </div>

          {/* City / Destination */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Destination City
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Mumbai', 'Goa'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCityFilter(c === 'All' ? '' : c)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    (c === 'All' && !cityFilter) || cityFilter.toLowerCase() === c.toLowerCase()
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
                  type="button"
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
                    <span className="ml-1 font-medium">{star}+ Star</span>
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
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm space-y-3">
              <Search className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="text-lg font-bold text-slate-800">No properties match those filters</h3>
              <p className="text-sm text-slate-500">
                Try clearing city or star rating filters to explore available stays.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCityFilter('');
                  setSearchQuery('');
                  setTypeFilter('');
                  setStarFilter(null);
                  setMaxPrice(25000);
                }}
                className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white"
              >
                Show All Stays
              </button>
            </div>
          ) : (
            filteredHotels.map((hotel) => {
              const isFav = favourites.includes(hotel.slug);
              const isCompared = compareList.includes(hotel.slug);
              return (
                <div
                  key={hotel.id}
                  className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative sm:w-72 h-48 sm:h-auto shrink-0 bg-slate-100">
                    <img
                      src={
                        hotel.heroImage ||
                        (hotel.slug.includes('grand')
                          ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
                          : hotel.slug.includes('azure')
                          ? 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80'
                          : 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80')
                      }
                      alt={hotel.name}
                      className="h-full w-full object-cover"
                    />
                    {hotel.isFeatured && (
                      <span className="absolute top-3 left-3 rounded-md bg-amber-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        Featured Stay
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleToggleFavourite(hotel.slug)}
                      className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-105 transition-transform"
                      aria-label={`Save ${hotel.name} to favourites`}
                    >
                      <Heart
                        className={`h-4 w-4 ${isFav ? 'fill-rose-600 text-rose-600' : 'text-slate-600'}`}
                      />
                    </button>
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

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <div>
                        <span className="text-[11px] text-slate-400">Nightly rate from</span>
                        <div className="text-xl font-extrabold text-slate-900">
                          ₹{hotel.minPrice.toLocaleString('en-IN')}{' '}
                          <span className="text-xs font-normal text-slate-500">+ taxes</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleCompare(hotel.slug)}
                          className={`rounded-xl px-3 py-2 text-xs font-semibold border transition-colors ${
                            isCompared
                              ? 'border-amber-600 bg-amber-50 text-amber-800'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {isCompared ? '✓ Comparing' : '+ Compare'}
                        </button>
                        <Link
                          href={`/hotels/${hotel.slug}${detailQuery}`}
                          className="rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors"
                        >
                          Select Rooms
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Property Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-amber-600" />
                <h3 className="font-bold text-base text-slate-900">Side-by-Side Hotel & Price Comparison</h3>
              </div>
              <button type="button" onClick={() => setShowCompareModal(false)} aria-label="Close comparison" className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500">
                    <th className="py-3 px-4 font-bold uppercase">Feature</th>
                    {comparedProperties.map((h) => (
                      <th key={h.slug} className="py-3 px-4 font-bold text-sm text-slate-900">
                        {h.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-500">Destination</td>
                    {comparedProperties.map((h) => (
                      <td key={h.slug} className="py-3 px-4 font-medium">{h.city}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-500">Nightly Starting Rate</td>
                    {comparedProperties.map((h) => (
                      <td key={h.slug} className="py-3 px-4 font-extrabold text-amber-700 text-sm">
                        ₹{h.minPrice.toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-500">Guest Rating</td>
                    {comparedProperties.map((h) => (
                      <td key={h.slug} className="py-3 px-4 font-bold">
                        ★ {h.avgRating} ({h.totalReviews} reviews)
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-500">Star Category</td>
                    {comparedProperties.map((h) => (
                      <td key={h.slug} className="py-3 px-4">{h.starRating} Star {h.type}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-500">Amenities</td>
                    {comparedProperties.map((h) => (
                      <td key={h.slug} className="py-3 px-4 space-y-1">
                        {h.amenities.slice(0, 3).map((a) => (
                          <div key={a} className="flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> {a}
                          </div>
                        ))}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4" />
                    {comparedProperties.map((h) => (
                      <td key={h.slug} className="py-3 px-4">
                        <Link
                          href={`/hotels/${h.slug}${detailQuery}`}
                          className="inline-block rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700"
                        >
                          Book Now →
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HotelsListingPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-slate-500 text-sm">Loading properties...</div>}>
      <HotelsListingContent />
    </React.Suspense>
  );
}
