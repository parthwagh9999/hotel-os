'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  UserCheck,
  Sparkles,
  Receipt,
  BrainCircuit,
  Settings,
  Building,
  ChevronRight,
} from 'lucide-react';

export function HotelSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/hotel/dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { href: '/hotel/front-desk', label: 'Front Desk PMS', icon: UserCheck },
    { href: '/hotel/rooms', label: 'Rooms & Inventory', icon: BedDouble },
    { href: '/hotel/housekeeping', label: 'Housekeeping Operations', icon: Sparkles },
    { href: '/hotel/finance', label: 'Finance & GST Invoicing', icon: Receipt },
    { href: '/hotel/ai-insights', label: 'AI Revenue & Forecasts', icon: BrainCircuit, badge: 'AI' },
    { href: '/hotel/onboarding', label: 'Property Onboarding', icon: Building },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200/60 dark:bg-amber-950/30 dark:border-amber-900/40">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
            Grand Palace Hotel
          </span>
        </div>
        <p className="text-[11px] text-amber-700/80 dark:text-amber-300/70 mt-0.5">
          Mumbai • Luxury Suite PMS
        </p>
      </div>

      <nav className="space-y-1">
        {links.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-amber-700 text-white'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

