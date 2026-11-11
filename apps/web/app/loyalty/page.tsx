'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Award,
  Crown,
  Gift,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  BedDouble,
  Utensils,
  Coffee,
} from 'lucide-react';

export default function LoyaltyRewardsPage() {
  const [points, setPoints] = useState(14850);
  const [redeemedVouchers, setRedeemedVouchers] = useState<string[]>([]);

  const perks = [
    { title: '15% Reward Points Multiplier', desc: 'Earn 15 points per ₹100 spent on all direct website bookings', icon: Zap },
    { title: 'Free Gourmet Breakfast for Two', desc: 'Daily multi-cuisine buffet breakfast at hotel all-day dining', icon: Coffee },
    { title: '1-Category Room Upgrade', desc: 'Complimentary upgrade to Executive or Sea-Facing suite upon check-in', icon: BedDouble },
    { title: 'Express Late Check-out', desc: 'Guaranteed late departure until 16:00 hrs at zero surcharge', icon: Clock },
  ];

  const rewardCatalog = [
    { id: 'r1', title: '₹2,500 Off Next Stay', cost: 2500, type: 'CASH_VOUCHER', desc: 'Instant discount coupon applied to your room folio' },
    { id: 'r2', title: 'Complimentary Spa & Sauna Pass', cost: 1800, type: 'EXPERIENCE', desc: '60-min Swedish massage or Ayurvedic wellness session' },
    { id: 'r3', title: 'Chef Special 3-Course In-Room Dinner', cost: 3200, type: 'DINING', desc: 'Exquisite private dining delivered to your suite' },
    { id: 'r4', title: 'Complimentary Airport Luxury Sedan Transfer', cost: 2000, type: 'TRAVEL', desc: 'Chauffeured pickup or drop to international airport' },
  ];

  const history = [
    { desc: 'Stay at The Grand Palace Hotel (3 Nights)', date: '11 May 2025', points: '+5,625 pts', type: 'EARNED' },
    { desc: 'Direct Website Booking Bonus (15%)', date: '11 May 2025', points: '+845 pts', type: 'EARNED' },
    { desc: 'Redeemed: ₹2,000 Stay Discount Voucher', date: '02 Apr 2025', points: '-2,000 pts', type: 'REDEEMED' },
    { desc: 'Stay at Budget Inn Executive (2 Nights)', date: '15 Mar 2025', points: '+960 pts', type: 'EARNED' },
  ];

  const handleRedeem = (item: typeof rewardCatalog[0]) => {
    if (points < item.cost) {
      alert('Insufficient points for this reward!');
      return;
    }

    setPoints(points - item.cost);
    setRedeemedVouchers([...redeemedVouchers, item.id]);
    alert(`Reward redeemed: "${item.title}"! Voucher code HOS-REWARD-${Math.floor(1000 + Math.random() * 9000)} issued.`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* ─── Hero Tier Card ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-amber-950 to-slate-900 p-8 sm:p-10 text-white shadow-2xl">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl -z-0" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-300">
              <Crown className="h-4 w-4" />
              <span>PLATINUM VOYAGER ELITE TIER</span>
            </div>
            <h1 className="text-3xl font-black sm:text-4xl text-white">
              Anita Roy's Hospitality Rewards
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Member since 2023 • Tier status valid through Dec 2026. Enjoy elite tier privileges across 25+ partner properties worldwide.
            </p>
          </div>

          {/* Points Counter Box */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-6 text-center shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
              Available Reward Points
            </span>
            <div className="text-4xl font-black text-amber-400 my-1">
              {points.toLocaleString('en-IN')}
            </div>
            <span className="text-xs text-slate-300">
              ≈ ₹{points.toLocaleString('en-IN')} Stay Value
            </span>
          </div>
        </div>

        {/* Tier Progress Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>Platinum Elite (14,850 pts)</span>
            <span className="text-amber-400">Next Tier: Diamond Crown (20,000 pts)</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
              style={{ width: `${(points / 20000) * 100}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400">
            5,150 more points needed to unlock complimentary Presidential Suite upgrades and dedicated butler service.
          </span>
        </div>
      </div>

      {/* ─── Elite Member Perks ────────────────────────────────────────────── */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Your Guaranteed Platinum Privileges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {perks.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                <p className="text-xs text-slate-500">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Rewards Redemption Catalog ────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Redeem Your Points for Stays & Experiences</h2>
            <p className="text-xs text-slate-500">1-click redemption applied directly to your booking confirmation</p>
          </div>
          <Link href="/hotels" className="text-xs font-bold text-amber-600 hover:underline">
            Book a Stay Now →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewardCatalog.map((item) => {
            const isRedeemed = redeemedVouchers.includes(item.id);
            return (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                      {item.type}
                    </span>
                    <span className="font-mono text-xs font-extrabold text-slate-900">
                      {item.cost.toLocaleString('en-IN')} pts
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </div>

                <button
                  onClick={() => handleRedeem(item)}
                  disabled={isRedeemed || points < item.cost}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isRedeemed
                      ? 'bg-emerald-100 text-emerald-800'
                      : points < item.cost
                      ? 'bg-slate-100 text-slate-400'
                      : 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm'
                  }`}
                >
                  {isRedeemed ? '✓ Voucher Issued' : points < item.cost ? 'Need More Points' : 'Redeem Now'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Points Activity Ledger ────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Recent Points Activity Ledger</h3>
        <div className="divide-y divide-slate-100 text-xs">
          {history.map((h, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-medium text-slate-900">{h.desc}</span>
                <div className="text-[11px] text-slate-400">{h.date}</div>
              </div>
              <span
                className={`font-mono font-bold ${
                  h.type === 'EARNED' ? 'text-emerald-600' : 'text-slate-600'
                }`}
              >
                {h.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
