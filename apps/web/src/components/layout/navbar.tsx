'use client';

import React, { useState } from 'react';
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
  Globe,
  KeyRound,
  Gift,
  ChevronDown,
} from 'lucide-react';
import { translations, SupportedLanguage } from '@hotel-os/shared';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const [langOpen, setLangOpen] = useState(false);

  const t = translations[lang] || translations.en;

  const languages: { code: SupportedLanguage; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
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
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <Link
            href="/hotels"
            className="flex items-center gap-1.5 transition-colors hover:text-amber-600"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>{t.discoverHotels}</span>
          </Link>

          <Link
            href="/hotel/dashboard"
            className="flex items-center gap-1.5 transition-colors hover:text-amber-600"
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>{t.hotelManagement}</span>
          </Link>

          <Link
            href="/check-in"
            className="flex items-center gap-1.5 transition-colors hover:text-amber-600"
          >
            <KeyRound className="h-3.5 w-3.5 text-amber-600" />
            <span>{t.contactlessCheckIn}</span>
          </Link>

          <Link
            href="/loyalty"
            className="flex items-center gap-1.5 transition-colors hover:text-amber-600"
          >
            <Gift className="h-3.5 w-3.5 text-purple-600" />
            <span>Rewards</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
          >
            <ShieldCheck className="h-3 w-3 text-amber-600" />
            <span>{t.superAdmin}</span>
          </Link>
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Regional Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
              title="Change Language"
            >
              <Globe className="h-3.5 w-3.5 text-amber-600" />
              <span className="uppercase">{lang}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg flex items-center justify-between ${
                      lang === l.code
                        ? 'bg-amber-50 text-amber-700 font-bold dark:bg-amber-950/40 dark:text-amber-300'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-[10px] text-slate-400">{l.native}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth State */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/hotel/dashboard"
                className="flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-slate-900 dark:text-slate-200"
              >
                <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </div>
                <span className="hidden sm:inline font-bold">{user.firstName}</span>
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
                className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {t.signIn}
              </Link>
              <Link
                href="/hotel/onboarding"
                className="rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition-colors"
              >
                {t.listYourHotel}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
