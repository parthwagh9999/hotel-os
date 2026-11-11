import React from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                HOTEL<span className="text-amber-600">OS</span>
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Next-generation enterprise hospitality ecosystem. Built for independent
              boutique hotels, luxury resorts, and multi-property chains.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>OWASP ASVS 5.0.0 & DPDP 2025 Compliant</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              For Travelers (B2C)
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/hotels" className="hover:text-amber-600">
                  Search & Explore
                </Link>
              </li>
              <li>
                <Link href="/hotels?city=Mumbai" className="hover:text-amber-600">
                  Mumbai Luxury Stays
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-600">
                  Manage Reservations
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-600">
                  Loyalty Points & Rewards
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              For Hoteliers (B2B)
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/hotel/onboarding" className="hover:text-amber-600">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href="/hotel/dashboard" className="hover:text-amber-600">
                  Property Management System (PMS)
                </Link>
              </li>
              <li>
                <Link href="/hotel/housekeeping" className="hover:text-amber-600">
                  Housekeeping Dashboard
                </Link>
              </li>
              <li>
                <Link href="/hotel/ai-insights" className="hover:text-amber-600">
                  AI Revenue Optimization
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Enterprise & Admin
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/admin" className="hover:text-amber-600">
                  Super Admin Console
                </Link>
              </li>
              <li>
                <a
                  href="http://localhost:4000/api/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-600"
                >
                  OpenAPI / Swagger Docs
                </a>
              </li>
              <li>
                <span className="text-xs text-slate-400">
                  Multi-tenant Isolation • PostgreSQL • Prisma • Redis
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-8 dark:border-slate-800 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} HOTEL OS. Open-source enterprise hospitality software.</p>
        </div>
      </div>
    </footer>
  );
}

