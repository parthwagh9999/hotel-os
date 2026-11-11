'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  QrCode,
  Sparkles,
  ArrowRight,
  FileCheck,
  Building2,
  Clock,
  KeyRound,
} from 'lucide-react';

export default function CheckInLookupPage() {
  const router = useRouter();
  const [bookingRef, setBookingRef] = useState('HOS-7K2X9P');
  const [guestLastName, setGuestLastName] = useState('Roy');

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingRef) return;
    router.push(`/check-in/${encodeURIComponent(bookingRef.trim().toUpperCase())}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-lg mb-4">
            <KeyRound className="h-7 w-7" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            Express Contactless Portal
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Contactless Mobile Self Check-In
          </h1>
          <p className="mt-2 text-xs text-slate-500">
            Skip the front-desk queue. Verify your identity, sign digitally, and receive your room key QR instantly.
          </p>
        </div>

        {/* Lookup Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Booking Reference (PNR)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value.toUpperCase())}
                  placeholder="e.g. HOS-7K2X9P"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm font-bold text-slate-900 uppercase focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Found in your SMS / email booking confirmation</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Lead Guest Last Name
              </label>
              <input
                type="text"
                value={guestLastName}
                onChange={(e) => setGuestLastName(e.target.value)}
                placeholder="e.g. Roy"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-amber-700 transition-colors"
            >
              <span>Locate Reservation & Begin Check-In</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Demo Pre-fill */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Sample Active Reservations (Click to test):
            </span>
            <div className="space-y-1.5">
              {[
                { ref: 'HOS-7K2X9P', name: 'Dr. Anita Roy', room: 'Deluxe Heritage #204' },
                { ref: 'HOS-4P6C8W', name: 'Mrs. Kavita Iyer', room: 'Presidential Suite #401' },
              ].map((item) => (
                <button
                  key={item.ref}
                  type="button"
                  onClick={() => {
                    setBookingRef(item.ref);
                    setGuestLastName(item.name.split(' ').pop() || '');
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200/60 transition-colors flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-slate-900">{item.ref}</span>
                    <span className="text-slate-500 ml-2">({item.name})</span>
                  </div>
                  <span className="text-[10px] text-amber-700 font-semibold">{item.room}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security & Regulatory Notice */}
        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-slate-100/80 p-4 text-[11px] text-slate-600">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>
            Encrypted according to Indian DPDP Act 2025 guidelines. Government ID is securely verified solely for statutory hospitality registration.
          </span>
        </div>
      </div>
    </div>
  );
}
