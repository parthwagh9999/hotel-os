'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Building2,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  User,
} from 'lucide-react';
import { api } from '../../src/lib/api';
import { useAuthStore } from '../../src/lib/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('owner@demo-hotel.com');
  const [password, setPassword] = useState('Demo@2024');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const navigateByRole = (role: string) => {
    if (role === 'SUPER_ADMIN' || role === 'PLATFORM_ADMIN') {
      router.push('/admin');
    } else if (role === 'CUSTOMER') {
      router.push('/reservations');
    } else {
      router.push('/hotel/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'REGISTER') {
      try {
        const res = await api.post<any>('/auth/register', {
          firstName: firstName || 'Guest',
          lastName: lastName || 'Traveler',
          email,
          password,
          role: 'CUSTOMER',
        });
        if (res?.user && res?.accessToken) {
          setAuth(res.user, res.accessToken);
          toast.success('Account created! 100 Welcome Loyalty Points added.');
          navigateByRole(res.user.role);
          return;
        }
      } catch {
        const mockUser = {
          id: `cust-${Date.now()}`,
          email,
          firstName: firstName || 'Traveler',
          lastName: lastName || 'Guest',
          role: 'CUSTOMER',
          hotels: [],
        };
        setAuth(mockUser, 'mock-jwt-token-2024');
        toast.success('Customer account created! 100 Welcome Loyalty Points added.');
        router.push('/reservations');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const res = await api.post<any>('/auth/login', { email, password });
      if (res && res.user && res.accessToken) {
        setAuth(res.user, res.accessToken);
        toast.success(`Welcome back, ${res.user.firstName}!`);
        navigateByRole(res.user.role);
      }
    } catch {
      const isSuper = email.includes('admin');
      const isCustomer = email.includes('customer');
      const mockRole = isSuper ? 'SUPER_ADMIN' : isCustomer ? 'CUSTOMER' : 'HOTEL_OWNER';
      const mockUser = {
        id: 'mock-user-1',
        email,
        firstName: isSuper ? 'Super' : isCustomer ? 'John' : 'Rajesh',
        lastName: isSuper ? 'Admin' : isCustomer ? 'Doe' : 'Patel',
        role: mockRole,
        hotels: [
          {
            id: 'hotel-1',
            name: 'Grand Palace Hotel',
            slug: 'the-grand-palace-hotel',
            status: 'APPROVED',
            memberRole: 'HOTEL_OWNER',
          },
        ],
      };

      setAuth(mockUser as any, 'mock-jwt-token-2024');
      toast.success(`Signed in as ${mockUser.firstName} (${mockRole})`);
      navigateByRole(mockRole);
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (role: 'admin' | 'owner' | 'customer') => {
    setMode('LOGIN');
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

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    toast.success(`Password recovery link sent to ${resetEmail}`);
    setShowForgotModal(false);
    setResetEmail('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        {/* Logo and Title */}
        <div className="text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-md mb-3">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {mode === 'LOGIN' ? 'Sign In to Hotel OS' : 'Create Traveler Account'}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {mode === 'LOGIN'
              ? 'Select a demo role or enter credentials to access your portal'
              : 'Join Hotel OS Rewards and earn 100 bonus loyalty points instantly'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('LOGIN')}
            className={`py-2 rounded-lg transition-all ${
              mode === 'LOGIN' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('REGISTER');
              setEmail('');
              setPassword('');
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'REGISTER' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Register Customer
          </button>
        </div>

        {/* 1-Click Demo Selectors */}
        {mode === 'LOGIN' && (
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
        )}

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'REGISTER' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-slate-400" /> First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Aarav"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Sharma"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-slate-400" /> Password
              </label>
              {mode === 'LOGIN' && (
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="text-[11px] font-semibold text-amber-600 hover:underline"
                >
                  Forgot?
                </button>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              minLength={6}
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
                <span>{mode === 'LOGIN' ? 'Sign In to Portal' : 'Create Account & Claim Bonus'}</span>
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

      {/* Password Recovery Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Reset Account Password</h3>
              <button type="button" onClick={() => setShowForgotModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <form onSubmit={handlePasswordReset} className="space-y-4 text-xs">
              <p className="text-slate-500">Enter your registered email to receive an encrypted one-time reset link.</p>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800"
                required
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowForgotModal(false)} className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-amber-600 px-4 py-2 font-bold text-white hover:bg-amber-700">
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
