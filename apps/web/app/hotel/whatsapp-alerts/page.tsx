'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Send,
  CheckCheck,
  ShieldCheck,
  Phone,
  ExternalLink,
} from 'lucide-react';

interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'GUEST_COMMUNICATION' | 'OPERATIONS';
  trigger: string;
  previewMessage: string;
  actionButton?: string;
  link?: string;
}

interface DispatchLogItem {
  id: string;
  template: string;
  recipient: string;
  timestamp: string;
  status: 'DELIVERED';
}

export default function WhatsAppAlertsPage() {
  const templates: WhatsAppTemplate[] = [
    {
      id: 't1',
      name: 'Booking Confirmation & Voucher',
      category: 'GUEST_COMMUNICATION',
      trigger: 'Triggered instantly upon online booking confirmation or front-desk reservation',
      previewMessage:
        'Namaste Dr. Anita Roy! 🏨 Your reservation at *The Grand Palace Hotel & Spa* is confirmed.\n\n📅 *Dates:* 15 Jun – 18 Jun 2025 (3 Nights)\n🛏️ *Room:* Deluxe Heritage (#204)\n🔖 *Ref:* HOS-7K2X9P\n💰 *Total:* ₹44,250 (Paid in Full)\n\nWe look forward to welcoming you to Mumbai!',
      actionButton: 'View Digital Stay Voucher',
      link: '/booking/confirmation/HOS-7K2X9P',
    },
    {
      id: 't2',
      name: '24-Hour Pre-Arrival Express Check-In',
      category: 'GUEST_COMMUNICATION',
      trigger: 'Automated dispatch 24 hours prior to scheduled check-in time (14:00 hrs)',
      previewMessage:
        'Hello Dr. Anita Roy! Your stay at *The Grand Palace Hotel* starts tomorrow.\n\n⚡ *Skip the front desk queue:* Complete your 60-second digital check-in now to receive your express room key pass.',
      actionButton: 'Start Contactless Check-In',
      link: '/check-in/HOS-7K2X9P',
    },
    {
      id: 't3',
      name: 'Housekeeping Operations Room Dispatch',
      category: 'OPERATIONS',
      trigger: 'Dispatched to cleaner mobile phone upon front desk check-out transition',
      previewMessage:
        '🔔 *Housekeeping Task Alert*\n\nCleaner: *Sunita Sharma*\nRoom: *#102 (Floor 1)*\nPriority: *URGENT — Checkout Sanitization*\nETA for Next Arrival: *14:00 hrs*\n\nPlease log in to Hotel OS to complete sanitization checklist.',
      actionButton: 'Open Housekeeping Checklist',
      link: '/hotel/housekeeping',
    },
    {
      id: 't4',
      name: 'Express Check-Out GST Folio & Tax Invoice',
      category: 'GUEST_COMMUNICATION',
      trigger: 'Dispatched immediately when guest departs front desk with settled billing',
      previewMessage:
        'Thank you for staying at *The Grand Palace Hotel*! ✨\n\nYour checkout invoice *#INV-2025-001* has been settled.\n📄 *Gross Amount:* ₹44,250\n🧾 *GST Tax Included:* ₹6,750 (18% Slab)\n\nWe hope to host you again soon.',
      actionButton: 'Download GST Invoice',
      link: '/hotel/finance',
    },
  ];

  const [activeTemplate, setActiveTemplate] = useState<WhatsAppTemplate>(templates[0]);
  const [recipientPhone, setRecipientPhone] = useState('+91 98201 12345');
  const [dispatchLog, setDispatchLog] = useState<DispatchLogItem[]>([
    {
      id: 'log-1',
      template: 'Booking Confirmation & Voucher',
      recipient: '+91 98201 12345',
      timestamp: '10:32 AM',
      status: 'DELIVERED',
    },
  ]);

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientPhone.trim()) return;
    const newEntry: DispatchLogItem = {
      id: `log-${Date.now()}`,
      template: activeTemplate.name,
      recipient: recipientPhone.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'DELIVERED',
    };
    setDispatchLog([newEntry, ...dispatchLog.slice(0, 4)]);
    toast.success(`Simulated WhatsApp "${activeTemplate.name}" delivered to ${recipientPhone}!`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Meta WhatsApp Business API • Sandbox Gateway
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl mt-0.5">
            Automated WhatsApp Operations Dispatcher
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated hospitality triggers for pre-arrival self check-ins, instant booking vouchers, staff task alerts, and checkout GST invoices.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-800">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Verified Official Hotel OS Business Account</span>
        </div>
      </div>

      {/* ─── Two-Column Layout: Templates List + Live Phone Simulator ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Operational Notification Triggers
          </h2>

          <div className="space-y-3">
            {templates.map((tpl) => {
              const isSelected = activeTemplate.id === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setActiveTemplate(tpl)}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{tpl.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        tpl.category === 'OPERATIONS'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {tpl.category === 'OPERATIONS' ? 'STAFF OPS' : 'GUEST NOTIFICATION'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{tpl.trigger}</p>
                </div>
              );
            })}
          </div>

          {/* Quick Test Message Dispatch Form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Dispatch Live Simulated WhatsApp Message</h3>
            <form onSubmit={handleSendTest} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Recipient Mobile (WhatsApp Number)
                </label>
                <input
                  type="text"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                  placeholder="+91 XXXXX XXXXX"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Simulate WhatsApp Webhook Delivery</span>
              </button>
            </form>

            {/* Recent Dispatch Log */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Recent Dispatch Webhook Log
              </span>
              {dispatchLog.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs bg-slate-50 rounded-xl px-3 py-2">
                  <div>
                    <span className="font-bold text-slate-800">{item.template}</span>
                    <span className="text-slate-400 ml-2">to {item.recipient}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700">
                    ✓ {item.status} ({item.timestamp})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mobile WhatsApp Screen Preview */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-[340px] rounded-[40px] border-8 border-slate-900 bg-slate-100 shadow-2xl overflow-hidden">
            <div className="bg-slate-900 h-6 flex items-center justify-center">
              <div className="h-1.5 w-16 bg-slate-700 rounded-full" />
            </div>

            <div className="bg-[#075e54] p-3 text-white flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                HO
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-1 font-bold text-xs truncate">
                  <span>Grand Palace Hotel</span>
                  <span className="text-[10px] text-emerald-300">✓</span>
                </div>
                <div className="text-[10px] text-emerald-200">Official Business Account</div>
              </div>
              <Phone className="h-4 w-4 text-emerald-200" />
            </div>

            <div className="p-3 space-y-3 bg-[#efeae2] min-h-[440px] flex flex-col justify-end">
              <div className="mx-auto rounded-lg bg-amber-100/80 px-2 py-1 text-[9px] text-amber-900 text-center font-semibold">
                🔒 End-to-end encrypted with Hotel OS Verified Gateway
              </div>

              <div className="bg-white rounded-2xl rounded-tl-none p-3.5 shadow-sm text-xs text-slate-800 space-y-2 relative border border-black/5">
                <div className="whitespace-pre-line text-[11px] leading-relaxed">
                  {activeTemplate.previewMessage}
                </div>

                <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 pt-1">
                  <span>12:45 PM</span>
                  <CheckCheck className="h-3 w-3 text-blue-500" />
                </div>

                {activeTemplate.actionButton && (
                  <div className="pt-2 border-t border-slate-100">
                    <Link
                      href={activeTemplate.link || '/'}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 text-center text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>{activeTemplate.actionButton}</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-2 border-t border-slate-200 text-center text-[10px] text-slate-400">
              Hotel OS Live WhatsApp Gateway
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
