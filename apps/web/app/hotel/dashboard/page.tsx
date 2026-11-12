'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BedDouble,
  UserCheck,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  Info,
} from 'lucide-react';
import { getAllBookings } from '../../../src/lib/demo-data';

type DateRangeKey = 'TODAY' | 'LAST_7' | 'THIS_MONTH';

const PERIOD_METRICS: Record<
  DateRangeKey,
  {
    label: string;
    occupancyRate: number;
    occupiedRooms: number;
    availableRooms: number;
    arrivals: number;
    departures: number;
    revenue: number;
    monthlyRevenue: number;
    adr: number;
    revpar: number;
  }
> = {
  TODAY: {
    label: "Today's",
    occupancyRate: 60.0,
    occupiedRooms: 24,
    availableRooms: 12,
    arrivals: 8,
    departures: 5,
    revenue: 284000,
    monthlyRevenue: 3450000,
    adr: 11833,
    revpar: 7100,
  },
  LAST_7: {
    label: 'Last 7 Days',
    occupancyRate: 74.5,
    occupiedRooms: 30,
    availableRooms: 10,
    arrivals: 52,
    departures: 47,
    revenue: 2140000,
    monthlyRevenue: 3450000,
    adr: 12450,
    revpar: 9275,
  },
  THIS_MONTH: {
    label: 'This Month',
    occupancyRate: 71.2,
    occupiedRooms: 28,
    availableRooms: 12,
    arrivals: 194,
    departures: 181,
    revenue: 3450000,
    monthlyRevenue: 3450000,
    adr: 12110,
    revpar: 8622,
  },
};

export default function HotelDashboardPage() {
  const [range, setRange] = useState<DateRangeKey>('TODAY');
  const stats = PERIOD_METRICS[range];

  const [recentBookings, setRecentBookings] = useState([
    { ref: 'HOS-7K2X9P', guest: 'Dr. Anita Roy', room: '204', type: 'Deluxe Heritage', status: 'CONFIRMED', amount: 44250 },
    { ref: 'HOS-9N4L2Q', guest: 'Rohan Deshmukh', room: '302', type: 'Executive Suite', status: 'CHECKED_IN', amount: 55500 },
    { ref: 'HOS-1M8B4V', guest: 'Siddharth Sen', room: '105', type: 'Standard Room', status: 'CHECKED_IN', amount: 18000 },
    { ref: 'HOS-4P6C8W', guest: 'Kavita Iyer', room: '401', type: 'Presidential Suite', status: 'CONFIRMED', amount: 105000 },
  ]);

  useEffect(() => {
    const stored = getAllBookings();
    const mapped = stored
      .filter((b) => !['HOS-7K2X9P', 'HOS-2R8K4M'].includes(b.bookingRef))
      .map((b, i) => ({
        ref: b.bookingRef,
        guest: b.guestName,
        room: `${210 + i}`,
        type: `${b.categoryName}`,
        status: b.status,
        amount: b.totalAmount,
      }));
    if (mapped.length > 0) {
      setRecentBookings((prev) => [...mapped, ...prev].slice(0, 8));
    }
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ─── Top Welcome & Quick Action Header ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Operations Active • Grand Palace Hotel
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl mt-1">
            Good Afternoon, Hotel Operations Team
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Live hotel performance, room occupancy, and front-desk flow. Click any KPI card to drill down.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Filter Selector */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 text-xs font-semibold shadow-sm">
            {(
              [
                { id: 'TODAY', label: 'Today' },
                { id: 'LAST_7', label: 'Last 7 Days' },
                { id: 'THIS_MONTH', label: 'This Month' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRange(opt.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  range === opt.id ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <Link
            href="/hotel/front-desk"
            className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition-colors"
          >
            <UserCheck className="h-4 w-4" />
            <span>Front Desk PMS Mode</span>
          </Link>
        </div>
      </div>

      {/* ─── 5 Critical Questions Metric Cards (All Clickable) ─────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Q1 & Q2: Occupancy -> Rooms */}
        <Link
          href="/hotel/rooms"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2 hover:border-amber-400 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Live Occupancy</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <BedDouble className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.occupancyRate}%
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>{stats.occupiedRooms} Occupied</span>
            <span className="text-emerald-600 font-semibold">{stats.availableRooms} Available</span>
          </div>
        </Link>

        {/* Q3: Arrivals & Departures -> Front Desk */}
        <Link
          href="/hotel/front-desk"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2 hover:border-blue-400 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Front Desk Flow</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.arrivals} Arrivals
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>{stats.label}</span>
            <span className="text-slate-600 font-semibold">{stats.departures} Departures</span>
          </div>
        </Link>

        {/* Q4: Revenue -> Finance */}
        <Link
          href="/hotel/finance"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2 hover:border-emerald-400 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{stats.label} Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{stats.revenue.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>MTD: ₹{(stats.monthlyRevenue / 100000).toFixed(1)}L</span>
            <span className="text-emerald-600 font-semibold">+14% vs last mo</span>
          </div>
        </Link>

        {/* Industry Metrics: ADR & RevPAR -> AI Insights */}
        <Link
          href="/hotel/ai-insights"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2 hover:border-purple-400 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1" title="Average Daily Rate = Room Revenue / Occupied Rooms; RevPAR = Room Revenue / Total Rooms">
              ADR & RevPAR <Info className="h-3 w-3 text-slate-400" />
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{stats.adr.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>Avg Price/Room</span>
            <span className="font-semibold text-purple-700">
              RevPAR: ₹{stats.revpar.toLocaleString('en-IN')}
            </span>
          </div>
        </Link>
      </div>

      {/* Simple Glossary Bar for Hoteliers New to KPIs */}
      <div className="rounded-2xl bg-slate-100/80 border border-slate-200/70 px-4 py-3 text-[11px] text-slate-600 flex flex-wrap gap-x-6 gap-y-1">
        <span><strong>ADR (Average Daily Rate):</strong> Average rental income earned per occupied room.</span>
        <span><strong>RevPAR (Revenue Per Available Room):</strong> Occupancy % × ADR — measures overall pricing & fill efficiency.</span>
      </div>

      {/* ─── Q5: What Needs My Attention Today? ────────────────────────────── */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <h2 className="text-base font-bold text-amber-950">
            Requires Attention Today (4 Operational Items)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-white p-4 border border-amber-100 shadow-sm flex items-start gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500 shrink-0 mt-1" />
            <div>
              <span className="text-xs font-bold text-slate-900">3 Rooms Need Sanitization</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Rooms 102, 204, 305 pending</p>
              <Link href="/hotel/housekeeping" className="text-[11px] font-bold text-amber-600 hover:underline mt-2 inline-block">
                Assign Housekeeping →
              </Link>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 border border-amber-100 shadow-sm flex items-start gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0 mt-1" />
            <div>
              <span className="text-xs font-bold text-slate-900">Weekend Surge Pricing</span>
              <p className="text-[11px] text-slate-500 mt-0.5">AI suggests +15% on Deluxe Rooms</p>
              <Link href="/hotel/ai-insights" className="text-[11px] font-bold text-amber-600 hover:underline mt-2 inline-block">
                Review AI Pricing →
              </Link>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 border border-amber-100 shadow-sm flex items-start gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shrink-0 mt-1" />
            <div>
              <span className="text-xs font-bold text-slate-900">VIP Arrival at 15:30 hrs</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Presidential Suite (Mrs. Iyer)</p>
              <Link href="/hotel/front-desk" className="text-[11px] font-bold text-amber-600 hover:underline mt-2 inline-block">
                Open Front Desk Folio →
              </Link>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 border border-amber-100 shadow-sm flex items-start gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-purple-500 shrink-0 mt-1" />
            <div>
              <span className="text-xs font-bold text-slate-900">2 In-Room Dining KOTs</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Room #204 & #401 cooking</p>
              <Link href="/hotel/dining" className="text-[11px] font-bold text-amber-600 hover:underline mt-2 inline-block">
                Kitchen Dispatch →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Recent Reservations Table ─────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Booking Reservations</h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time bookings synced across web engine & front desk</p>
          </div>
          <Link href="/hotel/front-desk" className="text-xs font-bold text-amber-600 hover:underline">
            View All Stays →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Guest Name</th>
                <th className="py-3 px-4">Room #</th>
                <th className="py-3 px-4">Room Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentBookings.map((b) => (
                <tr key={b.ref} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{b.ref}</td>
                  <td className="py-3 px-4 font-medium">{b.guest}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">#{b.room}</td>
                  <td className="py-3 px-4">{b.type}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        b.status === 'CHECKED_IN'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                    ₹{b.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
