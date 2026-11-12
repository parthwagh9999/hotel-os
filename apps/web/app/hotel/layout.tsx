import React from 'react';
import Link from 'next/link';
import { HotelSidebar } from '../../src/components/layout/hotel-sidebar';

const MOBILE_HOTEL_LINKS = [
  { href: '/hotel/dashboard', label: 'Dashboard' },
  { href: '/hotel/front-desk', label: 'Front Desk' },
  { href: '/hotel/rooms', label: 'Rooms' },
  { href: '/hotel/housekeeping', label: 'Housekeeping' },
  { href: '/hotel/dining', label: 'Dining POS' },
  { href: '/hotel/finance', label: 'Finance' },
  { href: '/hotel/heatmap', label: 'Heatmap' },
  { href: '/hotel/ai-insights', label: 'AI Insights' },
  { href: '/hotel/assistant', label: 'Copilot' },
  { href: '/hotel/whatsapp-alerts', label: 'WhatsApp' },
];

export default function HotelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <HotelSidebar />
      <nav aria-label="Hotel PMS mobile navigation" className="md:hidden flex items-center gap-2 overflow-x-auto bg-white border-b border-slate-200 px-4 py-2.5 text-xs font-bold">
        {MOBILE_HOTEL_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-lg bg-slate-100 px-3 py-1.5 text-slate-700 hover:bg-amber-600 hover:text-white transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 sm:p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
