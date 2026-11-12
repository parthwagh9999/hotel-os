'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Sparkles,
  CheckCircle2,
  IndianRupee,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function AiInsightsPage() {
  const [pricingRecs, setPricingRecs] = useState([
    {
      id: 'p1',
      category: 'Deluxe Heritage Room',
      currentPrice: 12500,
      suggestedPrice: 14370,
      delta: 1870,
      pct: 15.0,
      status: 'SURGE',
      reason: 'Weekend occupancy pacing at 88%. Strong leisure surge demand.',
      applied: false,
    },
    {
      id: 'p2',
      category: 'Executive Sea-Facing Suite',
      currentPrice: 18500,
      suggestedPrice: 20350,
      delta: 1850,
      pct: 10.0,
      status: 'SURGE',
      reason: 'Low remaining inventory (only 2 suites left for upcoming Friday).',
      applied: false,
    },
    {
      id: 'p3',
      category: 'Standard Room',
      currentPrice: 7500,
      suggestedPrice: 6750,
      delta: -750,
      pct: -10.0,
      status: 'DISCOUNT',
      reason: 'Mid-week lull detected (Wednesday occupancy <35%). Promotional rate will maximize RevPAR.',
      applied: false,
    },
  ]);

  const [cancellationRisks] = useState([
    {
      bookingRef: 'HOS-9N4L2Q',
      guest: 'Rohan Deshmukh',
      room: 'Executive Suite',
      checkIn: '22 Jun 2025',
      riskScore: 78,
      riskLevel: 'HIGH',
      factors: ['Lead time > 45 days', 'Pay-at-hotel (no deposit guarantee)'],
      suggestedAction: 'Send automated WhatsApp message requesting a 25% deposit guarantee.',
    },
    {
      bookingRef: 'HOS-1M8B4V',
      guest: 'Siddharth Sen',
      room: 'Standard Room',
      checkIn: '18 Jun 2025',
      riskScore: 42,
      riskLevel: 'MEDIUM',
      factors: ['OTA third-party booking channel with flexible policy'],
      suggestedAction: 'Send digital pre-checkin link with customized amenities.',
    },
  ]);

  const forecastData = [
    { date: '12 Jun', day: 'Thu', occ: 58, rooms: 23, demand: 'MEDIUM' },
    { date: '13 Jun', day: 'Fri', occ: 84, rooms: 34, demand: 'PEAK' },
    { date: '14 Jun', day: 'Sat', occ: 92, rooms: 37, demand: 'PEAK' },
    { date: '15 Jun', day: 'Sun', occ: 74, rooms: 30, demand: 'HIGH' },
    { date: '16 Jun', day: 'Mon', occ: 52, rooms: 21, demand: 'LOW' },
    { date: '17 Jun', day: 'Tue', occ: 55, rooms: 22, demand: 'LOW' },
    { date: '18 Jun', day: 'Wed', occ: 62, rooms: 25, demand: 'MEDIUM' },
    { date: '19 Jun', day: 'Thu', occ: 68, rooms: 27, demand: 'MEDIUM' },
    { date: '20 Jun', day: 'Fri', occ: 88, rooms: 35, demand: 'PEAK' },
    { date: '21 Jun', day: 'Sat', occ: 95, rooms: 38, demand: 'PEAK' },
  ];

  const [sentDepositRefs, setSentDepositRefs] = useState<string[]>([]);

  const handleApplyPricing = (id: string) => {
    const rec = pricingRecs.find((r) => r.id === id);
    setPricingRecs(
      pricingRecs.map((p) => (p.id === id ? { ...p, applied: true } : p))
    );
    toast.success(`Dynamic rate for ${rec?.category || 'category'} (₹${rec?.suggestedPrice.toLocaleString('en-IN')}) applied live!`);
  };

  const handleSendDepositRequest = (bookingRef: string, guest: string) => {
    setSentDepositRefs([...sentDepositRefs, bookingRef]);
    toast.success(`Automated WhatsApp 25% deposit confirmation dispatched to ${guest} (${bookingRef})`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              <Sparkles className="h-3.5 w-3.5" /> AI Revenue Engine Active
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl mt-1">
            Predictive Hospitality Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            10-day time-series occupancy forecasts, price elasticity adjustments, and pre-arrival cancellation prevention.
          </p>
        </div>

        {/* Model Accuracy Badge */}
        <div className="rounded-xl bg-slate-900 text-white p-3 text-xs flex items-center gap-4 shadow-sm">
          <div>
            <span className="text-[10px] uppercase text-slate-400 font-bold">Model</span>
            <div className="font-mono font-bold text-amber-400">HOS-Ensemble-v1.4</div>
          </div>
          <div className="border-l border-slate-700 pl-4">
            <span className="text-[10px] uppercase text-slate-400 font-bold">MAE Error</span>
            <div className="font-mono font-bold text-emerald-400">±3.8%</div>
          </div>
        </div>
      </div>

      {/* ─── Section 1: 10-Day Occupancy Forecast Bar Chart ────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">10-Day Occupancy Projection & Demand Heatmap</h2>
            <p className="text-xs text-slate-500">Evaluated against historical seasonal booking pace and day-of-week lift</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-red-600">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Peak (&gt;80%)
            </span>
            <span className="flex items-center gap-1.5 text-amber-600">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Medium (60-80%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" /> Baseline (&lt;60%)
            </span>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-6">
          {forecastData.map((d) => (
            <div key={d.date} className="flex flex-col items-center gap-2">
              <span className="text-[11px] font-extrabold text-slate-800">{d.occ}%</span>
              <div className="w-full bg-slate-100 rounded-t-xl h-36 flex items-end p-1">
                <div
                  className={`w-full rounded-lg transition-all duration-500 ${
                    d.demand === 'PEAK'
                      ? 'bg-gradient-to-t from-red-600 to-amber-500 shadow-md'
                      : d.demand === 'HIGH'
                      ? 'bg-amber-500'
                      : 'bg-slate-400'
                  }`}
                  style={{ height: `${d.occ}%` }}
                />
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-slate-900">{d.date}</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">{d.day}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Section 2: Dynamic Pricing Recommendations ────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-amber-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">AI Revenue Dynamic Pricing Opportunities</h2>
              <p className="text-xs text-slate-500">Human-in-the-loop review. Apply suggestions with 1-click or configure auto-pilot.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingRecs.map((rec) => (
            <div
              key={rec.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between shadow-sm transition-all ${
                rec.applied
                  ? 'border-emerald-200 bg-emerald-50/30'
                  : 'border-slate-200 bg-white hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{rec.category}</span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-extrabold ${
                      rec.status === 'SURGE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {rec.status === 'SURGE' ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {rec.pct > 0 ? `+${rec.pct}%` : `${rec.pct}%`}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-slate-900">
                    ₹{rec.suggestedPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    ₹{rec.currentPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {rec.reason}
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-3">
                {rec.applied ? (
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 py-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Applied to Booking Engine</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleApplyPricing(rec.id)}
                    className="w-full rounded-xl bg-amber-600 py-2.5 text-xs font-bold text-white shadow hover:bg-amber-700 transition-colors"
                  >
                    Approve Price Adjustment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Section 3: Pre-Arrival Cancellation Risk Scoring ───────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldAlert className="h-5 w-5 text-red-600" />
          <div>
            <h2 className="text-base font-bold text-slate-900">High-Risk Cancellation Early Warning</h2>
            <p className="text-xs text-slate-500">Identifies uncommitted reservations to protect hotel revenue and avoid no-shows.</p>
          </div>
        </div>

        <div className="space-y-4">
          {cancellationRisks.map((c) => (
            <div
              key={c.bookingRef}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-red-100 bg-red-50/30 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{c.bookingRef}</span>
                  <span className="font-bold text-slate-800">{c.guest}</span>
                  <span className="text-slate-400">• {c.room}</span>
                  <span className="rounded bg-red-100 px-2 py-0.5 font-extrabold text-red-800 text-[10px]">
                    Risk Score: {c.riskScore}% ({c.riskLevel})
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
                  {c.factors.map((f) => (
                    <span key={f} className="rounded bg-white px-2 py-0.5 border border-red-200/50">
                      ⚠️ {f}
                    </span>
                  ))}
                </div>
                <p className="mt-2 font-semibold text-slate-700">
                  Recommended Action: <span className="font-normal">{c.suggestedAction}</span>
                </p>
              </div>

              <button
                type="button"
                disabled={sentDepositRefs.includes(c.bookingRef)}
                onClick={() => handleSendDepositRequest(c.bookingRef, c.guest)}
                className={`rounded-xl px-4 py-2.5 text-xs font-bold shadow shrink-0 transition-colors ${
                  sentDepositRefs.includes(c.bookingRef)
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {sentDepositRefs.includes(c.bookingRef) ? '✓ Request Dispatched' : 'Send Deposit Request'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

