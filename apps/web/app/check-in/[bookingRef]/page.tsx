'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import {
  KeyRound,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Calendar,
  CreditCard,
  User,
  Clock,
  Sparkles,
  QrCode,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  FileCheck,
  Wifi,
  PhoneCall,
  MapPin,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ bookingRef: string }>;
}

export default function ContactlessCheckInFlow({ params }: PageProps) {
  const resolvedParams = use(params);
  const bookingRef = (resolvedParams.bookingRef || 'HOS-7K2X9P').toUpperCase();

  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState('AADHAAR');
  const [docNumber, setDocNumber] = useState('XXXX-XXXX-4589');
  const [etaTime, setEtaTime] = useState('14:30');
  const [specialRequests, setSpecialRequests] = useState('High floor room, extra hypoallergenic pillows');
  const [signatureName, setSignatureName] = useState('Dr. Anita Roy');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Reservation details
  const reservation = {
    ref: bookingRef,
    hotelName: 'The Grand Palace Hotel & Spa',
    city: 'Mumbai',
    roomCategory: 'Deluxe Heritage Room',
    roomNumber: '204',
    checkIn: 'Today, 14:00 hrs',
    checkOut: '18 Jun 2025, 11:00 hrs',
    guestName: 'Dr. Anita Roy',
    phone: '+91 98201 12345',
    totalAmount: 37500,
    paidAmount: 37500,
    wifiPass: 'GrandPalaceGuest@2025',
    accessPin: '8204',
  };

  const handleFinishCheckIn = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Brand & Reference Header */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 mb-2">
            <KeyRound className="h-3.5 w-3.5" />
            Express Front Desk Bypass
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Self Check-In: {bookingRef}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {reservation.hotelName} • {reservation.city}
          </p>
        </div>

        {/* ─── Completed Digital Key View ────────────────────────────────────── */}
        {isCompleted ? (
          <div className="rounded-3xl border border-emerald-200 bg-white p-6 sm:p-8 shadow-xl text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Check-in Verified & Room Key Issued
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Welcome to {reservation.hotelName}!
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your government ID has been authenticated. Present this digital key pass at the express kiosk or elevator reader.
              </p>
            </div>

            {/* Digital Key Card */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 p-6 text-white text-left shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                    DIGITAL ROOM PASS
                  </span>
                  <div className="text-lg font-bold">{reservation.guestName}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">ROOM NUMBER</span>
                  <div className="text-3xl font-black text-amber-400">#{reservation.roomNumber}</div>
                </div>
              </div>

              {/* QR Code Simulation */}
              <div className="my-6 flex flex-col items-center justify-center">
                <div className="bg-white p-3 rounded-2xl shadow-inner">
                  <div className="h-36 w-36 bg-slate-900 rounded-lg flex items-center justify-center text-white text-center p-2">
                    <QrCode className="h-28 w-28 text-white" />
                  </div>
                </div>
                <span className="font-mono text-xs text-amber-300 font-bold mt-2">
                  PIN CODE: {reservation.accessPin}
                </span>
              </div>

              {/* In-Stay Info */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-amber-400" />
                  <div>
                    <div className="text-[10px] text-slate-400">Wi-Fi Password</div>
                    <div className="font-mono font-bold text-white">{reservation.wifiPass}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <div>
                    <div className="text-[10px] text-slate-400">Check-out Time</div>
                    <div className="font-bold text-white">11:00 AM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Navigation CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/hotel/dining"
                className="flex-1 rounded-xl bg-amber-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition-colors"
              >
                Order Room Service & Dining
              </Link>
              <Link
                href={`/booking/confirmation/${reservation.ref}`}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                View Full Booking Voucher
              </Link>
            </div>
          </div>
        ) : (
          /* ─── Multi-Step Form ─────────────────────────────────────────────────── */
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
            {/* Step Indicators */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider pb-4 border-b border-slate-100">
              <span className={step >= 1 ? 'text-amber-600' : ''}>1. Reservation</span>
              <span className={step >= 2 ? 'text-amber-600' : ''}>2. ID Upload</span>
              <span className={step >= 3 ? 'text-amber-600' : ''}>3. Signature</span>
              <span className={step >= 4 ? 'text-amber-600' : ''}>4. Key Issue</span>
            </div>

            {/* Step 1: Confirm Reservation */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900">Review Reservation Details</h3>
                <div className="rounded-2xl bg-amber-50/60 border border-amber-200/50 p-4 space-y-3 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lead Guest:</span>
                    <span className="font-bold text-slate-900">{reservation.guestName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Room Category:</span>
                    <span className="font-bold text-slate-900">{reservation.roomCategory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned Room:</span>
                    <span className="font-bold text-amber-700">Room #{reservation.roomNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Stay Duration:</span>
                    <span className="font-bold text-slate-900">3 Nights (15 Jun – 18 Jun)</span>
                  </div>
                  <div className="flex justify-between border-t border-amber-200/40 pt-2">
                    <span className="text-slate-500">Payment Status:</span>
                    <span className="font-bold text-emerald-600">PAID IN FULL (₹{reservation.totalAmount.toLocaleString('en-IN')})</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Estimated Time of Arrival (ETA)
                  </label>
                  <input
                    type="time"
                    value={etaTime}
                    onChange={(e) => setEtaTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-amber-600 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition-colors"
                >
                  <span>Continue to ID Verification</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Step 2: ID Upload */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900">Government ID Verification</h3>
                <p className="text-xs text-slate-500">
                  Per statutory tourism guidelines in India, all adult guests must present valid photo identification.
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {['AADHAAR', 'PASSPORT', 'DRIVING_LICENSE'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setDocType(type)}
                      className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                        docType === type
                          ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {docType} Number / Reference
                  </label>
                  <input
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="Enter document identifier"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 font-mono text-sm text-slate-900 focus:border-amber-600 focus:outline-none"
                  />
                </div>

                {/* Simulated Document Upload Box */}
                <div className="border-2 border-dashed border-amber-300 rounded-2xl p-6 text-center bg-amber-50/30">
                  <UploadCloud className="mx-auto h-8 w-8 text-amber-600 mb-2" />
                  <span className="text-xs font-bold text-slate-800 block">
                    Identity Document Captured
                  </span>
                  <span className="text-[11px] text-slate-500">
                    aadhaar_front_verified.jpg (248 KB) • Securely encrypted
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-600 py-3 text-xs font-bold text-white hover:bg-amber-700"
                  >
                    <span>Proceed to Signature</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Digital Signature */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900">Digital Registration Signature</h3>
                <p className="text-xs text-slate-500">
                  Sign below to authorize hotel registration and acknowledge property check-in regulations.
                </p>

                {/* Signature Pad Simulation */}
                <div className="rounded-2xl border border-slate-300 bg-slate-50 p-4 relative">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">Digital Signature Area</div>
                  <div className="h-24 flex items-center justify-center border-b border-dashed border-slate-300">
                    <span className="font-serif italic text-2xl text-slate-800 tracking-wider">
                      {signatureName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
                    <span>IP Timestamp Verified • {new Date().toLocaleDateString()}</span>
                    <span className="text-emerald-600 font-bold">256-Bit Cryptographic Hash</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Signatory Full Name
                  </label>
                  <input
                    type="text"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-amber-600 focus:outline-none"
                  />
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="terms" className="text-xs text-slate-600">
                    I certify that the provided identification details are accurate and agree to the hotel policies, check-out timing (11:00 AM), and non-smoking property regulations.
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={!agreedTerms || isSubmitting}
                    onClick={handleFinishCheckIn}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-600 py-3 text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Verifying & Issuing Key...' : 'Complete Check-In & Get Key'}</span>
                    <Sparkles className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
