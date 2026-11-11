'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  Building2,
  Users,
  CreditCard,
  FileText,
  Activity,
  Sliders,
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Platform Overview', icon: Activity },
    { href: '/admin#hotels', label: 'Hotels & Approvals', icon: Building2 },
    { href: '/admin#users', label: 'Platform Users', icon: Users },
    { href: '/admin#subscriptions', label: 'SaaS Subscriptions', icon: CreditCard },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-slate-900 text-white min-h-[calc(100vh-4rem)] p-4">
      <div className="mb-6 px-3 py-3 rounded-xl bg-slate-800/80 border border-slate-700">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-bold tracking-wide uppercase text-slate-200">
            Super Admin Portal
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Full Multi-tenant Ecosystem Governance
        </p>
      </div>

      <nav className="space-y-1.5">
        {links.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 text-slate-400" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
