'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  UserCheck,
  UserX,
  Plus,
  Search,
  CheckCircle2,
  Printer,
  Building,
} from 'lucide-react';
import { api } from '../../../src/lib/api';
import {
  getAllBookings,
  saveBookingRecord,
  updateBookingStatusRecord,
} from '../../../src/lib/demo-data';

export default function FrontDeskPMSPage() {
  const [arrivals, setArrivals] = useState([
    { id: 'b1', ref: 'HOS-7K2X9P', guest: 'Dr. Anita Roy', phone: '+91 98201 12345', room: '204', category: 'Deluxe Heritage', status: 'CONFIRMED', checkInTime: '14:00' },
    { id: 'b2', ref: 'HOS-4P6C8W', guest: 'Mrs. Kavita Iyer', phone: '+91 98111 98765', room: '401', category: 'Presidential Suite', status: 'CONFIRMED', checkInTime: '15:30' },
    { id: 'b3', ref: 'HOS-3X9M2L', guest: 'Amitabh Sharma', phone: '+91 99200 44556', room: '108', category: 'Standard Room', status: 'CONFIRMED', checkInTime: '16:00' },
  ]);

  const [departures, setDepartures] = useState([
    { id: 'b4', ref: 'HOS-9N4L2Q', guest: 'Rohan Deshmukh', phone: '+91 97690 11223', room: '302', category: 'Executive Suite', status: 'CHECKED_IN', balance: 0 },
    { id: 'b5', ref: 'HOS-1M8B4V', guest: 'Siddharth Sen', phone: '+91 98450 33445', room: '105', category: 'Standard Room', status: 'CHECKED_IN', balance: 0 },
  ]);

  useEffect(() => {
    const stored = getAllBookings();
    const extraArrivals = stored
      .filter((b) => b.status === 'CONFIRMED' && b.bookingRef !== 'HOS-7K2X9P')
      .map((b, i) => ({
        id: b.bookingRef,
        ref: b.bookingRef,
        guest: b.guestName,
        phone: b.guestPhone || '+91 98765 43210',
        room: `${210 + i}`,
        category: `${b.categoryName} (${b.hotelName})`,
        status: 'CONFIRMED',
        checkInTime: '14:00',
      }));
    const extraInHouse = stored
      .filter((b) => b.status === 'CHECKED_IN')
      .map((b, i) => ({
        id: b.bookingRef,
        ref: b.bookingRef,
        guest: b.guestName,
        phone: b.guestPhone || '+91 98765 43210',
        room: `${310 + i}`,
        category: `${b.categoryName} (${b.hotelName})`,
        status: 'CHECKED_IN',
        balance: 0,
      }));
    if (extraArrivals.length > 0) {
      setArrivals((prev) => [...extraArrivals, ...prev]);
    }
    if (extraInHouse.length > 0) {
      setDepartures((prev) => [...extraInHouse, ...prev]);
    }
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInName, setWalkInName] = useState('');
  const [walkInRoom, setWalkInRoom] = useState('102');
  const [walkInNights, setWalkInNights] = useState('1');

  const handleCheckIn = async (bookingId: string) => {
    const item = arrivals.find((a) => a.id === bookingId);
    if (item) {
      updateBookingStatusRecord(item.ref, 'CHECKED_IN');
      setArrivals(arrivals.filter((a) => a.id !== bookingId));
      setDepartures([
        {
          id: item.id,
          ref: item.ref,
          guest: item.guest,
          phone: item.phone,
          room: item.room,
          category: item.category,
          status: 'CHECKED_IN',
          balance: 0,
        },
        ...departures,
      ]);
      toast.success(`${item.guest} checked in to Room #${item.room}!`);
    }

    try {
      await api.post(`/bookings/${bookingId}/check-in`);
    } catch {
      // Seamless client simulation
    }
  };

  const handleCheckOut = async (bookingId: string) => {
    const item = departures.find((d) => d.id === bookingId);
    if (item) {
      updateBookingStatusRecord(item.ref, 'CHECKED_OUT');
    }
    setDepartures(departures.filter((d) => d.id !== bookingId));
    toast.success(
      `${item?.guest || 'Guest'} checked out! Room #${item?.room || ''} queued for Housekeeping sanitization.`
    );

    try {
      await api.post(`/bookings/${bookingId}/check-out`);
    } catch {
      // Seamless client simulation
    }
  };

  const handleWalkInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName.trim()) return;

    const ref = `HOS-W${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      id: ref,
      ref,
      guest: walkInName.trim(),
      phone: '+91 98000 00000',
      room: walkInRoom,
      category: 'Deluxe Heritage',
      status: 'CHECKED_IN',
      balance: 0,
    };

    const nightsCount = Math.max(1, Number(walkInNights) || 1);
    const total = Math.round(12500 * nightsCount * 1.18);
    saveBookingRecord({
      bookingRef: ref,
      hotelSlug: 'the-grand-palace-hotel',
      hotelName: 'The Grand Palace Hotel & Spa',
      hotelAddress: 'Apollo Bunder, Colaba, Mumbai 400001',
      city: 'Mumbai',
      categoryName: 'Deluxe Heritage Room',
      guestName: newBooking.guest,
      guestEmail: 'walkin@demo-hotel.com',
      guestPhone: newBooking.phone,
      guests: 2,
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + nightsCount * 86400000).toISOString().split('T')[0],
      nights: nightsCount,
      nightlyRate: 12500,
      gstPercent: 18,
      taxAmount: Math.round(12500 * nightsCount * 0.18),
      totalAmount: total,
      paymentMethod: 'CASH',
      status: 'CHECKED_IN',
      createdAt: new Date().toISOString(),
    });

    setDepartures([newBooking, ...departures]);
    setShowWalkInModal(false);
    setWalkInName('');
    toast.success(`Walk-in guest ${newBooking.guest} checked in to Room #${walkInRoom}!`);
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredArrivals = arrivals.filter(
    (a) =>
      !q ||
      a.guest.toLowerCase().includes(q) ||
      a.ref.toLowerCase().includes(q) ||
      a.room.includes(q)
  );
  const filteredDepartures = departures.filter(
    (d) =>
      !q ||
      d.guest.toLowerCase().includes(q) ||
      d.ref.toLowerCase().includes(q) ||
      d.room.includes(q)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ─── Top Header & Walk-In Action ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Property Management System (PMS)
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl mt-0.5">
            Front Desk Operations Board
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            1-click express check-ins, guest verification, room changes, and instant checkout billing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guest, PNR, room #"
              className="rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-600"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowWalkInModal(true)}
            className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Walk-in Guest</span>
          </button>
        </div>
      </div>

      {/* ─── Status Overview Badges ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400">Expected Arrivals</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{arrivals.length}</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400">In-House Guests</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{departures.length}</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Building className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400">Expected Departures</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{departures.length}</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <UserX className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* ─── 2-Column Board: Arrivals vs Departures ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Arrivals Column */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-amber-50/50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-amber-600" />
              <h2 className="font-bold text-sm text-slate-900">
                Today's Expected Arrivals ({filteredArrivals.length})
              </h2>
            </div>
            <span className="text-xs font-semibold text-amber-800">Check-In From 14:00</span>
          </div>

          <div className="p-4 divide-y divide-slate-100">
            {filteredArrivals.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                All matching scheduled arrivals have checked in!
              </div>
            ) : (
              filteredArrivals.map((a) => (
                <div key={a.id} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{a.guest}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                        {a.ref}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Room #{a.room} • {a.category} • ETA: {a.checkInTime}
                    </p>
                    <span className="text-[11px] text-slate-400">{a.phone}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCheckIn(a.id)}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors shrink-0"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Check In</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Departures Column */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-slate-700" />
              <h2 className="font-bold text-sm text-slate-900">
                In-House & Departures ({filteredDepartures.length})
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">Check-Out By 11:00</span>
          </div>

          <div className="p-4 divide-y divide-slate-100">
            {filteredDepartures.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No matching active in-house guests at this time.
              </div>
            ) : (
              filteredDepartures.map((d) => (
                <div key={d.id} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{d.guest}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                        IN-HOUSE
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Room #{d.room} • {d.category}
                    </p>
                    <span className="text-[11px] text-slate-400">Balance: ₹{d.balance}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCheckOut(d.id)}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-colors shrink-0"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Check Out</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ─── Fast Walk-in Guest Modal ───────────────────────────────────────── */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Fast Reception Walk-in Booking</h3>
              <button
                type="button"
                onClick={() => setShowWalkInModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleWalkInSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">Guest Full Name</label>
                <input
                  type="text"
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Assign Room</label>
                  <select
                    value={walkInRoom}
                    onChange={(e) => setWalkInRoom(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="102">Room #102 (Available)</option>
                    <option value="104">Room #104 (Available)</option>
                    <option value="201">Room #201 (Available)</option>
                    <option value="304">Room #304 (Available)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">Nights</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={walkInNights}
                    onChange={(e) => setWalkInNights(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
                Payment: Settle at front desk (Cash / Card / POS). Room status will immediately transition to <strong>OCCUPIED</strong>.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-amber-700"
                >
                  Check In Guest Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
