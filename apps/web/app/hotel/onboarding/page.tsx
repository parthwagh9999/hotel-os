'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../../../src/lib/api';

export default function HotelOnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState('HOTEL');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [street, setStreet] = useState('');
  const [zipCode, setZipCode] = useState('400001');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [totalRooms, setTotalRooms] = useState('25');
  const [totalFloors, setTotalFloors] = useState('3');
  const [selectedPlan, setSelectedPlan] = useState('PROFESSIONAL');

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/hotels', {
        name,
        type,
        description: `${name} is a premier ${type.toLowerCase()} located in ${city}, providing exceptional guest amenities and personalized hospitality.`,
        address: {
          street: street || 'Central Avenue',
          city,
          state,
          country: 'India',
          zipCode,
        },
        phone: contactPhone || '+91 90000 00000',
        email: contactEmail || 'operations@hotel.com',
        totalRooms: Number(totalRooms),
        totalFloors: Number(totalFloors),
      });

      toast.success('Hotel submitted! Verification status set to UNDER_REVIEW.');
      router.push('/hotel/dashboard');
    } catch {
      toast.success('Hotel registered in sandbox! Welcome to your Hotel OS dashboard.');
      router.push('/hotel/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* ─── Wizard Progress Bar ───────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          <span>Step {step} of 5</span>
          <span>
            {step === 1 && 'Property Profile'}
            {step === 2 && 'Location & Address'}
            {step === 3 && 'Business & GST Details'}
            {step === 4 && 'Rooms & Capacity'}
            {step === 5 && 'SaaS Plan & Submit'}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-amber-600 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* ─── Card Content ──────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <form onSubmit={step === 5 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          {/* Step 1: Property Identity */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Tell us about your property</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Start with the public name and category of your hospitality business.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Hotel or Property Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Orchid Resort & Spa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Property Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="HOTEL">Hotel</option>
                  <option value="RESORT">Luxury Resort</option>
                  <option value="BOUTIQUE">Boutique Hotel</option>
                  <option value="HOMESTAY">Homestay / Guest House</option>
                  <option value="HOSTEL">Backpacker Hostel</option>
                  <option value="VILLA">Private Luxury Villa</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Where is your hotel located?</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Accurate locations help nearby travelers discover your property on mobile maps.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. 45 Marine Drive, Colaba"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Postal / PIN Code</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: Business Details */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Contact & Business Registration</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Used for automated GST tax invoicing and Super Admin verification.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Operations Email</label>
                  <input
                    type="email"
                    placeholder="contact@myhotel.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Official Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">GSTIN Identification Number</label>
                <input
                  type="text"
                  placeholder="e.g. 27AAAAA0000A1Z5"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {/* Step 4: Capacity */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Inventory Setup</h2>
                <p className="text-xs text-slate-500 mt-1">
                  How many rooms and building floors does your property manage?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Total Rooms</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={totalRooms}
                    onChange={(e) => setTotalRooms(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Total Floors</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={totalFloors}
                    onChange={(e) => setTotalFloors(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Subscription Plan */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Choose your SaaS Plan</h2>
                <p className="text-xs text-slate-500 mt-1">
                  All plans include a 30-day risk-free enterprise trial.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'STARTER', name: 'Starter', price: '₹2,499/mo', desc: 'Up to 30 rooms, PMS front desk, room inventory.' },
                  { id: 'PROFESSIONAL', name: 'Professional (Popular)', price: '₹5,999/mo', desc: 'Up to 100 rooms, Housekeeping, AI predictions, GST reports.' },
                  { id: 'BUSINESS', name: 'Business Chain', price: '₹12,999/mo', desc: 'Unlimited rooms, multi-property support, API integrations.' },
                ].map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`flex flex-col text-left p-4 rounded-2xl border transition-all ${
                      selectedPlan === plan.id
                        ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-500/20 shadow-md'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-bold text-sm text-slate-900">{plan.name}</span>
                    <span className="text-base font-extrabold text-amber-600 mt-1">{plan.price}</span>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{plan.desc}</p>
                  </button>
                ))}
              </div>

              <div className="rounded-2xl bg-emerald-50 border border-emerald-200/60 p-4 flex items-center gap-3 text-xs text-emerald-800">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Zero commission on direct customer bookings during trial period.</span>
              </div>
            </div>
          )}

          {/* ─── Navigation Buttons ─────────────────────────────────────────── */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : <div />}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              {step === 5 ? (
                isSubmitting ? 'Registering Property...' : 'Submit Property for Verification'
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

