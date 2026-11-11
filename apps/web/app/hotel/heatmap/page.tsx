'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Users,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  UserCheck,
  BedDouble,
  Info,
} from 'lucide-react';

interface HeatmapDay {
  date: string;
  day: string;
  occupancy: number;
  arrivals: number;
  departures: number;
  status: 'LOW' | 'MODERATE' | 'HIGH' | 'PEAK';
  suggestedRate: number;
  frontDeskStaff: number;
  housekeepingStaff: number;
  scheduledStaff: number;
}

export default function SmartHeatmapPage() {
  const [filterMode, setFilterMode] = useState<'ALL' | 'WEEKENDS' | 'PEAK'>('ALL');
  const [selectedDay, setSelectedDay] = useState<HeatmapDay | null>(null);

  // 30-day forecast simulation
  const days: HeatmapDay[] = [
    { date: '12 Jun', day: 'Thu', occupancy: 60, arrivals: 8, departures: 5, status: 'MODERATE', suggestedRate: 12500, frontDeskStaff: 2, housekeepingStaff: 3, scheduledStaff: 5 },
    { date: '13 Jun', day: 'Fri', occupancy: 85, arrivals: 14, departures: 4, status: 'PEAK', suggestedRate: 14375, frontDeskStaff: 4, housekeepingStaff: 5, scheduledStaff: 8 },
    { date: '14 Jun', day: 'Sat', occupancy: 95, arrivals: 18, departures: 8, status: 'PEAK', suggestedRate: 15600, frontDeskStaff: 4, housekeepingStaff: 6, scheduledStaff: 9 },
    { date: '15 Jun', day: 'Sun', occupancy: 75, arrivals: 6, departures: 15, status: 'HIGH', suggestedRate: 13000, frontDeskStaff: 3, housekeepingStaff: 5, scheduledStaff: 7 },
    { date: '16 Jun', day: 'Mon', occupancy: 45, arrivals: 5, departures: 9, status: 'LOW', suggestedRate: 11000, frontDeskStaff: 2, housekeepingStaff: 3, scheduledStaff: 5 },
    { date: '17 Jun', day: 'Tue', occupancy: 50, arrivals: 7, departures: 4, status: 'MODERATE', suggestedRate: 11500, frontDeskStaff: 2, housekeepingStaff: 3, scheduledStaff: 5 },
    { date: '18 Jun', day: 'Wed', occupancy: 62, arrivals: 9, departures: 6, status: 'MODERATE', suggestedRate: 12000, frontDeskStaff: 2, housekeepingStaff: 4, scheduledStaff: 6 },
    { date: '19 Jun', day: 'Thu', occupancy: 70, arrivals: 11, departures: 7, status: 'HIGH', suggestedRate: 13200, frontDeskStaff: 3, housekeepingStaff: 4, scheduledStaff: 7 },
    { date: '20 Jun', day: 'Fri', occupancy: 90, arrivals: 16, departures: 5, status: 'PEAK', suggestedRate: 15000, frontDeskStaff: 4, housekeepingStaff: 5, scheduledStaff: 8 },
    { date: '21 Jun', day: 'Sat', occupancy: 98, arrivals: 19, departures: 7, status: 'PEAK', suggestedRate: 16500, frontDeskStaff: 5, housekeepingStaff: 6, scheduledStaff: 9 },
    { date: '22 Jun', day: 'Sun', occupancy: 72, arrivals: 5, departures: 16, status: 'HIGH', suggestedRate: 12800, frontDeskStaff: 3, housekeepingStaff: 5, scheduledStaff: 7 },
    { date: '23 Jun', day: 'Mon', occupancy: 48, arrivals: 6, departures: 8, status: 'LOW', suggestedRate: 11000, frontDeskStaff: 2, housekeepingStaff: 3, scheduledStaff: 5 },
    { date: '24 Jun', day: 'Tue', occupancy: 52, arrivals: 8, departures: 6, status: 'MODERATE', suggestedRate: 11500, frontDeskStaff: 2, housekeepingStaff: 3, scheduledStaff: 5 },
    { date: '25 Jun', day: 'Wed', occupancy: 58, arrivals: 9, departures: 7, status: 'MODERATE', suggestedRate: 11800, frontDeskStaff: 2, housekeepingStaff: 3, scheduledStaff: 5 },
  ];

  const filteredDays = days.filter((d) => {
    if (filterMode === 'WEEKENDS') return d.day === 'Fri' || d.day === 'Sat' || d.day === 'Sun';
    if (filterMode === 'PEAK') return d.status === 'PEAK';
    return true;
  });

  const getBadgeColor = (status: HeatmapDay['status']) => {
    switch (status) {
      case 'PEAK':
        return 'bg-emerald-500 text-white';
      case 'HIGH':
        return 'bg-amber-500 text-white';
      case 'MODERATE':
        return 'bg-blue-500 text-white';
      case 'LOW':
        return 'bg-slate-400 text-white';
    }
  };

  const getHeatmapColor = (occupancy: number) => {
    if (occupancy >= 85) return 'bg-emerald-50 border-emerald-300 text-emerald-950 dark:bg-emerald-950/20';
    if (occupancy >= 70) return 'bg-amber-50 border-amber-300 text-amber-950 dark:bg-amber-950/20';
    if (occupancy >= 50) return 'bg-blue-50 border-blue-300 text-blue-950 dark:bg-blue-950/20';
    return 'bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-800/40';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Predictive Operations & Workforce Optimization
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl mt-0.5">
            Smart Demand Heatmap & Staffing Planner
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            AI-modeled 14-to-30 day occupancy heatmaps, turnover workload spikes, and recommended shift staff allocations.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {(['ALL', 'WEEKENDS', 'PEAK'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterMode === mode
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {mode === 'ALL' && 'All 14 Days'}
              {mode === 'WEEKENDS' && 'Fri-Sun Stays'}
              {mode === 'PEAK' && 'Peak Spikes (>85%)'}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Legend & Summary ───────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 border border-slate-200 shadow-sm text-xs">
        <div className="flex items-center gap-4">
          <span className="font-bold text-slate-700">Demand Heatmap Index:</span>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Peak (&gt;85%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-slate-600">High (70-85%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-slate-600">Moderate (50-70%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-slate-400" />
            <span className="text-slate-600">Low (&lt;50%)</span>
          </div>
        </div>

        <div className="text-slate-500">
          Showing <strong>{filteredDays.length}</strong> operational dates
        </div>
      </div>

      {/* ─── Calendar Grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {filteredDays.map((d) => (
          <div
            key={d.date}
            onClick={() => setSelectedDay(d)}
            className={`cursor-pointer rounded-2xl border p-4 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md ${getHeatmapColor(
              d.occupancy
            )}`}
          >
            <div className="flex items-center justify-between border-b border-black/5 pb-2">
              <div>
                <span className="text-xs font-black">{d.date}</span>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">{d.day}</span>
              </div>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${getBadgeColor(d.status)}`}>
                {d.occupancy}%
              </span>
            </div>

            <div className="mt-3 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Arrivals:</span>
                <span className="font-bold text-emerald-700">+{d.arrivals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Departures:</span>
                <span className="font-bold text-slate-700">-{d.departures}</span>
              </div>
              <div className="flex justify-between border-t border-black/5 pt-1">
                <span className="text-slate-500">Optimum Staff:</span>
                <span className="font-bold text-amber-900">
                  {d.frontDeskStaff + d.housekeepingStaff} Staff
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Detailed Shift Breakdown for Selected Day ─────────────────────── */}
      {selectedDay && (
        <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Staffing Allocation Optimizer
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">
                Operational Plan for {selectedDay.day}, {selectedDay.date} ({selectedDay.occupancy}% Occupancy)
              </h3>
            </div>
            <button
              onClick={() => setSelectedDay(null)}
              className="text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4 space-y-1">
              <span className="font-bold text-blue-900">Front Desk Roster</span>
              <div className="text-2xl font-black text-blue-900">{selectedDay.frontDeskStaff} Agents</div>
              <p className="text-blue-700 text-[11px]">
                Allocated to handle {selectedDay.arrivals} incoming check-ins and {selectedDay.departures} departures smoothly.
              </p>
            </div>

            <div className="rounded-2xl bg-purple-50 border border-purple-200 p-4 space-y-1">
              <span className="font-bold text-purple-900">Housekeeping Cleaners</span>
              <div className="text-2xl font-black text-purple-900">{selectedDay.housekeepingStaff} Cleaners</div>
              <p className="text-purple-700 text-[11px]">
                Needed to turnover {selectedDay.departures} checkout sanitizations before 14:00 check-in rush.
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 space-y-1">
              <span className="font-bold text-emerald-900">Revenue Yield Pricing</span>
              <div className="text-2xl font-black text-emerald-900">
                ₹{selectedDay.suggestedRate.toLocaleString('en-IN')}
              </div>
              <p className="text-emerald-700 text-[11px]">
                AI-recommended dynamic ADR base to optimize RevPAR during {selectedDay.status} demand.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
