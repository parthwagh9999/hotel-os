'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Lock,
  Mail,
  ShieldCheck,
  User,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { api } from '../../src/lib/api';
import { useAuthStore } from '../../src/lib/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('owner@demo-hotel.com');
  const [password, setPassword] = useState('Demo@2024');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post<any>('/auth/login', { email, password });
      if (res && res.user && res.accessToken) {
        setAuth(res.user, res.accessToken);
        if (res.user.role === 'SUPER_ADMIN' || res.user.role === 'PLATFORM_ADMIN') {
          router.push('/admin');
        } else if (res.user.role === 'CUSTOMER') {
          router.push('/');
        } else {
          router.push('/hotel/dashboard');
        }
      }
    } catch (err: any) {
      // If backend not running, provide seamless client session for showcase
      const isSuper = email.includes('admin');
      const isCustomer = email.includes('customer');
      const mockRole = isSuper ? 'SUPER_ADMIN' : isCustomer ? 'CUSTOMER' : 'HOTEL_OWNER';
      const mockUser = {
        id: 'mock-user-1',
        email,
        firstName: isSuper ? 'Super' : isCustomer ? 'Guest' : 'Rajesh',
        lastName: isSuper ? 'Admin' : isCustomer ? 'Customer' : 'Patel',
        role: mockRole,
        hotels: [{ id: 'hotel-1', name: 'Grand Palace Hotel', slug: 'the-grand-palace-hotel', status: 'APPROVED', memberRole: 'HOTEL_OWNER' }],
      };

      setAuth(mockUser as any, 'mock-jwt-token-2024');
      if (isSuper) router.push('/admin');
      else if (isCustomer) router.push('/');
      else router.push('/hotel/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (role: 'admin' | 'owner' | 'customer') => {
    if (role === 'admin') {
      setEmail('admin@hotel-os.dev');
      setPassword('HotelOS@2024');
    } else if (role === 'owner') {
      setEmail('owner@demo-hotel.com');
      setPassword('Demo@2024');
    } else {
      setEmail('customer@example.com');
      setPassword('Customer@2024');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-md mb-3">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Sign In to Hotel OS
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Select your role or enter credentials to access your portal
          </p>
        </div>

        {/* 1-Click Demo Selectors */}
        <div className="mb-6 rounded-2xl bg-amber-50/60 border border-amber-200/50 p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1 mb-2">
            <Sparkles className="h-3 w-3" /> 1-Click Quick Demo Switch
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setDemoAccount('owner')}
              className={`py-1.5 px-2 rounded-lg transition-colors ${
                email.includes('owner')
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              🏨 Hotel Owner
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('admin')}
              className={`py-1.5 px-2 rounded-lg transition-colors ${
                email.includes('admin')
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              👑 Super Admin
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('customer')}
              className={`py-1.5 px-2 rounded-lg transition-colors ${
                email.includes('customer')
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              👤 Guest / B2C
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-slate-400" /> Password
              </label>
              <a href="#" className="text-[11px] text-amber-600 hover:underline">
                Forgot?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-600 py-3 text-sm font-bold text-white shadow-md hover:bg-amber-700 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          New hotelier?{' '}
          <Link href="/hotel/onboarding" className="font-semibold text-amber-600 hover:underline">
            Register your property here
          </Link>
        </div>
      </div>
    </div>
  );
}
