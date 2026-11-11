'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../lib/auth-store';
import {
  Building2,
  User,
  LogOut,
  Calendar,
  Sparkles,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-md transition-transform group-hover:scale-105">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              HOTEL<span className="text-amber-600">OS</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Enterprise Hospitality
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link
            href="/hotels"
            className="flex items-center gap-1.5 transition-colors hover:text-amber-600"
          >
            <Compass className="h-4 w-4" />
            Discover Hotels
          </Link>
          <Link
            href="/hotel/dashboard"
            className="flex items-center gap-1.5 transition-colors hover:text-amber-600"
          >
            <Building2 className="h-4 w-4" />
            Hotel Management (B2B)
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
            Super Admin
          </Link>
        </nav>

        {/* Auth CTA */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/hotel/dashboard"
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-200"
              >
                <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </div>
                <span>{user.firstName}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-normal">
                  {user.role}
                </span>
              </Link>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Sign In
              </Link>
              <Link
                href="/hotel/onboarding"
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors"
              >
                List Your Hotel
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
