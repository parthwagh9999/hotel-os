'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  CheckCircle2,
  MapPin,
  QrCode,
  Download,
  ShieldCheck,
  Printer,
} from 'lucide-react';
import {
  StoredBooking,
  getBookingByRef,
  downloadTextFile,
  generateGstInvoiceHtml,
} from '../../../../src/lib/demo-data';

export default function BookingConfirmationPage() {
  const params = useParams();
  const ref = ((params?.ref as string) || 'HOS-7K2X9P').toUpperCase();
  const [booking, setBooking] = useState<StoredBooking | null>(null);

  useEffect(() => {
    const found = getBookingByRef(ref);
    setBooking(found || null);
  }, [ref]);

  const display = {
    hotelName: booking?.hotelName || 'The Grand Palace Hotel & Spa',
    hotelAddress: booking?.hotelAddress || 'Apollo Bunder, Colaba, Mumbai 400001',
    city: booking?.city || 'Mumbai',
    guestName: booking?.guestName || 'Dr. Anita Roy',
    guests: booking?.guests || 2,
    checkIn: booking?.checkIn || '2025-06-15',
    checkOut: booking?.checkOut || '2025-06-18',
    categoryName: booking?.categoryName || 'Deluxe Heritage Room',
    paymentMethod: booking?.paymentMethod || 'UPI',
    totalAmount: booking?.totalAmount || 44250,
    taxAmount: booking?.taxAmount || 6750,
    specialRequests: booking?.specialRequests || 'High-Floor Request Noted',
  };

  const handleDownloadInvoice = () => {
    const html = generateGstInvoiceHtml({
      invoiceNumber: `INV-${ref}`,
      bookingRef: ref,
      guestName: display.guestName,
      hotelName: display.hotelName,
      hotelAddress: display.hotelAddress,
      totalAmount: display.totalAmount,
      taxAmount: display.taxAmount,
      date: display.checkOut,
      status: 'PAID',
    });
    downloadTextFile(`GST-Invoice-${ref}.html`, html, 'text/html;charset=utf-8');
    toast.success(`Official GST Invoice (${ref}) downloaded!`);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* ─── Success Banner ─────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
          Reservation Confirmed & Guaranteed
        </span>
        <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
          You're all set for {display.city}!
        </h1>
        <p className="mt-2 text-xs text-slate-600 max-w-md mx-auto">
          A confirmation voucher and tax invoice have been generated. Present this QR code at front-desk check-in or use express mobile self check-in.
        </p>

        {/* Reference Pill */}
        <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-white px-5 py-2.5 shadow-sm border border-emerald-100">
          <span className="text-xs text-slate-400 font-medium">Booking Reference:</span>
          <span className="font-mono text-base font-extrabold tracking-wider text-slate-900">
            {ref}
          </span>
        </div>
      </div>

      {/* ─── Digital Pass / Folio Card ─────────────────────────────────────── */}
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-lg overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-950 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Verified Digital Guest Folio
            </span>
            <h2 className="text-xl font-bold mt-0.5">{display.hotelName}</h2>
            <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
              <MapPin className="h-3.5 w-3.5 text-amber-400" /> {display.hotelAddress}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-20 w-20 rounded-xl bg-white p-1 shadow-md flex items-center justify-center">
              <QrCode className="h-16 w-16 text-slate-900" />
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs border-b border-slate-100">
          <div>
            <span className="text-slate-400 uppercase font-bold tracking-wider text-[10px]">Guest Name</span>
            <p className="mt-1 font-bold text-sm text-slate-900">{display.guestName}</p>
            <span className="text-slate-400">{display.guests} Adults</span>
          </div>

          <div>
            <span className="text-slate-400 uppercase font-bold tracking-wider text-[10px]">Check-In</span>
            <p className="mt-1 font-bold text-sm text-slate-900">{display.checkIn}</p>
            <span className="text-slate-400">From 14:00 hrs</span>
          </div>

          <div>
            <span className="text-slate-400 uppercase font-bold tracking-wider text-[10px]">Check-Out</span>
            <p className="mt-1 font-bold text-sm text-slate-900">{display.checkOut}</p>
            <span className="text-slate-400">Until 11:00 hrs</span>
          </div>

          <div>
            <span className="text-slate-400 uppercase font-bold tracking-wider text-[10px]">Payment Status</span>
            <p className="mt-1 font-bold text-sm text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> PAID ({display.paymentMethod})
            </p>
            <span className="text-slate-400">Total: ₹{display.totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Accommodation Specs */}
        <div className="p-8 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div>
            <span className="font-bold text-slate-900">Reserved Accommodation:</span>
            <p className="text-slate-600 mt-0.5">
              {display.categoryName} • Free Wi-Fi • {display.specialRequests}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/check-in/${ref}`}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Self Check-In Now
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Printer className="h-3.5 w-3.5" /> Print Folio
            </button>
            <button
              type="button"
              onClick={handleDownloadInvoice}
              className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-700"
            >
              <Download className="h-3.5 w-3.5" /> Download GST Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Return Links */}
      <div className="mt-8 flex justify-center gap-6 text-xs font-semibold">
        <Link href="/reservations" className="text-amber-600 hover:underline">
          View My Reservations
        </Link>
        <span className="text-slate-300">•</span>
        <Link href="/" className="text-slate-600 hover:text-slate-900">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
