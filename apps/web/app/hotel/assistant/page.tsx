'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Send,
  Sparkles,
  Bot,
  User,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionPill?: {
    label: string;
    href: string;
  };
}

export default function AiHotelAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Namaste! I am your Hotel OS AI Operations Copilot. You can ask me anything about your occupancy, revenue, room availability, arrivals, or housekeeping status in plain English, Hindi, or Marathi.',
      timestamp: '12:00 PM',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const quickPrompts = [
    'How much revenue did we make this month?',
    'Which rooms are available right now?',
    'Who are the expected arrivals today?',
    'Which rooms need cleaning right now?',
    'What is our dining KOT status?',
    'What is our occupancy forecast for this weekend?',
    'What is our current ADR and RevPAR?',
  ];

  const handleSend = (queryToSend?: string) => {
    const q = (queryToSend || inputQuery).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      let reply = '';
      let pill: { label: string; href: string } | undefined;

      const lower = q.toLowerCase();

      if (lower.includes('revenue') || lower.includes('earn') || lower.includes('money') || lower.includes('कमाई') || lower.includes('महसूल')) {
        reply =
          'Your hotel has generated ₹34,50,000 (34.5 Lakhs) in gross room revenue MTD for this month. Today alone has accounted for ₹2,84,000 from 24 active in-house reservations. Operating profit is pacing at 83.8% after vendor settlements.';
        pill = { label: 'View Financial GST Ledger →', href: '/hotel/finance' };
      } else if (lower.includes('available') || lower.includes('empty') || lower.includes('उपलब्ध') || lower.includes('खोल्या')) {
        reply =
          'You currently have 12 rooms available for immediate check-in: 5 Deluxe Heritage rooms (#101, #104, #304), 4 Standard rooms (#106, #107), and 3 Executive Suites (#201, #202, #203). Overall occupancy is at 60.0%.';
        pill = { label: 'Open Room Inventory Matrix →', href: '/hotel/rooms' };
      } else if (lower.includes('arrival') || lower.includes('checkin') || lower.includes('check-in') || lower.includes('आगमन') || lower.includes('पाहुणे')) {
        reply =
          "You have 8 arrivals scheduled for today. 3 are pending front-desk key handover: Dr. Anita Roy (Room #204, ETA 14:00), Mrs. Kavita Iyer (Presidential Suite #401, ETA 15:30), and Amitabh Sharma (Room #108, ETA 16:00).";
        pill = { label: 'Launch Front Desk PMS Board →', href: '/hotel/front-desk' };
      } else if (lower.includes('clean') || lower.includes('housekeeping') || lower.includes('सफाई') || lower.includes('स्वच्छता')) {
        reply =
          'There are 4 rooms requiring housekeeping attention. Room #102 is currently IN_PROGRESS with Sunita Sharma. Room #204 is marked as URGENT checkout turnaround. Room #305 has finished cleaning and is awaiting manager inspection.';
        pill = { label: 'Open Housekeeping Tasks →', href: '/hotel/housekeeping' };
      } else if (lower.includes('dining') || lower.includes('kot') || lower.includes('food') || lower.includes('restaurant') || lower.includes('जेवण')) {
        reply =
          'The Kitchen Order Ticket (KOT) board has 3 active tickets: Room #204 (Paneer Butter Masala & Naan - PREPARING), Room #401 (Club Chicken Sandwich - PENDING), and Room #302 (Filter Coffee - READY FOR DELIVERY). All orders are auto-billed to room folios.';
        pill = { label: 'Open Kitchen POS & KOT Board →', href: '/hotel/dining' };
      } else if (lower.includes('forecast') || lower.includes('weekend') || lower.includes('heatmap') || lower.includes('staff')) {
        reply =
          'Our AI Smart Demand Heatmap forecasts 85% occupancy this Friday (13 Jun) and 95% occupancy this Saturday (14 Jun). Front desk staffing is scheduled for 4 agents and housekeeping for 6 cleaners to manage the 18 arrivals and 8 turnovers efficiently.';
        pill = { label: 'View Demand Heatmap & Staffing →', href: '/hotel/heatmap' };
      } else if (lower.includes('whatsapp') || lower.includes('msg') || lower.includes('alert')) {
        reply =
          'WhatsApp Business Gateway is active! Pre-arrival contactless check-in links, digital stay vouchers, and checkout invoices are being delivered in real-time to guest phone numbers.';
        pill = { label: 'Open WhatsApp Dispatcher →', href: '/hotel/whatsapp-alerts' };
      } else if (lower.includes('adr') || lower.includes('revpar') || lower.includes('rate') || lower.includes('pricing') || lower.includes('किंमत')) {
        reply =
          'Your Average Daily Rate (ADR) today is ₹11,833 and Revenue Per Available Room (RevPAR) is ₹7,100. Our AI Revenue Model suggests increasing Deluxe Room rates by +15% for upcoming Friday/Saturday due to 88% projected weekend occupancy.';
        pill = { label: 'Review AI Dynamic Pricing →', href: '/hotel/ai-insights' };
      } else {
        reply =
          `I analyzed your hotel database regarding "${q}". Your 40-room property is operating normally with 24 occupied rooms (60% occupancy), ₹2,84,000 revenue recorded today, and all server guards enforcing multi-tenant isolation.`;
        pill = { label: 'Go to Executive Dashboard →', href: '/hotel/dashboard' };
      }

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionPill: pill,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              <Sparkles className="h-3.5 w-3.5" /> Conversational PMS Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl mt-1">
            AI Hotel Operations Assistant
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ask natural language questions about your property, occupancy, daily revenue, front desk arrivals, and housekeeping.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold bg-white p-2 rounded-xl border border-slate-200 shadow-sm text-slate-600">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Connected to Grand Palace Hotel PMS DB</span>
        </div>
      </div>

      {/* ─── Quick Prompts Carousel ────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-semibold scrollbar-none">
        <span className="text-slate-400 text-[10px] uppercase font-bold shrink-0">Try asking:</span>
        {quickPrompts.map((p) => (
          <button
            key={p}
            onClick={() => handleSend(p)}
            className="shrink-0 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-slate-700 shadow-sm hover:border-amber-500 hover:text-amber-700 hover:bg-amber-50/50 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* ─── Chat Messages Log ─────────────────────────────────────────────── */}
      <div className="h-[480px] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 max-w-[85%] ${
              m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                m.sender === 'user'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-purple-100 text-purple-700 border border-purple-200 shadow-sm'
              }`}
            >
              {m.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div
              className={`rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 shadow-sm ${
                m.sender === 'user'
                  ? 'bg-amber-600 text-white rounded-tr-none'
                  : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none'
              }`}
            >
              <p>{m.text}</p>

              {m.actionPill && (
                <div className="pt-2 border-t border-slate-200/60">
                  <Link
                    href={m.actionPill.href}
                    className="inline-flex items-center gap-1 font-bold text-amber-700 bg-white px-3 py-1.5 rounded-lg border border-amber-200 shadow-xs hover:bg-amber-50 transition-colors"
                  >
                    <span>{m.actionPill.label}</span>
                  </Link>
                </div>
              )}

              <span
                className={`block text-[10px] ${
                  m.sender === 'user' ? 'text-amber-200 text-right' : 'text-slate-400'
                }`}
              >
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
              <Bot className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-2.5 text-xs">
              Analyzing PMS database metrics...
            </div>
          </div>
        )}
      </div>

      {/* ─── Query Input Box ───────────────────────────────────────────────── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-md"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask anything: e.g. 'How much revenue this month?' or 'Who are today's arrivals?'..."
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none"
        />
        <button
          type="submit"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-white shadow-sm hover:bg-amber-700 transition-colors shrink-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
