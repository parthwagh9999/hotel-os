'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from 'lucide-react';
import { api } from '../../src/lib/api';

export default function SuperAdminPortalPage() {
  const [hotels, setHotels] = useState([
    {
      id: 'h1',
      name: 'The Grand Palace Hotel & Spa',
      city: 'Mumbai',
      type: 'Luxury Hotel',
      rooms: 40,
      owner: 'Rajesh Patel',
      email: 'owner@demo-hotel.com',
      status: 'APPROVED',
      plan: 'PROFESSIONAL',
      joinedDate: '01 May 2025',
    },
    {
      id: 'h2',
      name: 'Budget Inn Executive Mumbai',
      city: 'Mumbai',
      type: 'Business Hotel',
      rooms: 25,
      owner: 'Suresh Rao',
      email: 'suresh@budgetinn.com',
      status: 'APPROVED',
      plan: 'STARTER',
      joinedDate: '15 May 2025',
    },
    {
      id: 'h3',
      name: 'Seaside Paradise Villa Resort',
      city: 'Goa',
      type: 'Resort',
      rooms: 18,
      owner: 'Maria D’Souza',
      email: 'maria@seasidegoa.com',
      status: 'SUBMITTED',
      plan: 'PROFESSIONAL',
      joinedDate: 'Yesterday',
    },
    {
      id: 'h4',
      name: 'Hilltop Haven Homestay',
      city: 'Manali',
      type: 'Homestay',
      rooms: 8,
      owner: 'Virender Thakur',
      email: 'virender@hilltophaven.com',
      status: 'UNDER_REVIEW',
      plan: 'STARTER',
      joinedDate: '2 days ago',
    },
  ]);

  const [users, setUsers] = useState([
    { id: 'u1', name: 'Super Admin', email: 'admin@hotel-os.dev', role: 'SUPER_ADMIN', status: 'ACTIVE', hotel: 'Global Platform' },
    { id: 'u2', name: 'Rajesh Patel', email: 'owner@demo-hotel.com', role: 'HOTEL_OWNER', status: 'ACTIVE', hotel: 'The Grand Palace Hotel' },
    { id: 'u3', name: 'John Doe', email: 'customer@example.com', role: 'CUSTOMER', status: 'ACTIVE', hotel: 'Guest Explorer' },
    { id: 'u4', name: 'Ramesh Pawar', email: 'ramesh@demo-hotel.com', role: 'HOUSEKEEPING_STAFF', status: 'ACTIVE', hotel: 'The Grand Palace Hotel' },
  ]);

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [commissionRate, setCommissionRate] = useState(10);

  const handleApproveHotel = async (hotelId: string) => {
    const target = hotels.find((h) => h.id === hotelId);
    setHotels(hotels.map((h) => (h.id === hotelId ? { ...h, status: 'APPROVED' } : h)));
    toast.success(`${target?.name || 'Hotel'} approved! Public booking enabled.`);

    try {
      await api.patch(`/admin/hotels/${hotelId}/status`, { status: 'APPROVED' });
    } catch {}
  };

  const handleRejectHotel = async (hotelId: string) => {
    const target = hotels.find((h) => h.id === hotelId);
    setHotels(hotels.map((h) => (h.id === hotelId ? { ...h, status: 'REJECTED' } : h)));
    toast.error(`${target?.name || 'Hotel'} application rejected.`);

    try {
      await api.patch(`/admin/hotels/${hotelId}/status`, { status: 'REJECTED' });
    } catch {}
  };

  const handleToggleUser = async (userId: string) => {
    const target = users.find((u) => u.id === userId);
    const nextStatus = target?.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
    );
    toast.success(`User ${target?.name || ''} marked ${nextStatus}`);

    try {
      await api.patch(`/admin/users/${userId}/toggle-active`);
    } catch {}
  };

  const pendingCount = hotels.filter((h) => h.status === 'SUBMITTED' || h.status === 'UNDER_REVIEW').length;
  const filteredHotels = hotels.filter((h) => (statusFilter === 'ALL' ? true : h.status === statusFilter));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ─── Top Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-600" /> Platform Super Admin
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl mt-1">
            Global Ecosystem Governance & Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-tenant controls, hotel onboarding verification, SaaS subscription billing, and security audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
            SaaS Platform v1.0.0
          </span>
        </div>
      </div>

      {/* ─── Executive Platform KPIs ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400">Total Registered Properties</span>
          <div className="text-3xl font-extrabold text-slate-900">{hotels.length}</div>
          <span className="text-xs text-amber-600 font-semibold">{pendingCount} Pending Verification</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400">Platform GMV Volume</span>
          <div className="text-3xl font-extrabold text-slate-900">₹84.2 Lakhs</div>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +24% QoQ Growth
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400">Platform Take-Rate ({commissionRate}%)</span>
          <div className="text-3xl font-extrabold text-emerald-600">
            ₹{(84.2 * (commissionRate / 100)).toFixed(2)} Lakhs
          </div>
          <span className="text-xs text-slate-500">Commissions & SaaS MRR</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400">Total Ecosystem Users</span>
          <div className="text-3xl font-extrabold text-slate-900">1,420</div>
          <span className="text-xs text-slate-500">Hoteliers, Staff, Guests</span>
        </div>
      </div>

      {/* ─── Hotel Verification Pipeline ───────────────────────────────────── */}
      <div id="hotels" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Hotel Onboarding & Verification Pipeline</h2>
            <p className="text-xs text-slate-500">Review business registration, verify licenses, and activate hotel public booking.</p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  statusFilter === status
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-4">Hotel Property</th>
                <th className="py-3 px-4">Owner / Contact</th>
                <th className="py-3 px-4">Rooms</th>
                <th className="py-3 px-4">SaaS Tier</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Verification Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredHotels.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No hotels matching filter &quot;{statusFilter}&quot;.
                  </td>
                </tr>
              ) : (
                filteredHotels.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-sm text-slate-900">{h.name}</div>
                      <div className="text-slate-400 text-[11px]">{h.city} • {h.type}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-800">{h.owner}</div>
                      <div className="text-slate-400 text-[11px]">{h.email}</div>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">{h.rooms} Rooms</td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {h.plan}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          h.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : h.status === 'REJECTED'
                            ? 'bg-red-100 text-red-700'
                            : h.status === 'SUBMITTED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {h.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {h.status !== 'APPROVED' ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleApproveHotel(h.id)}
                            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                          </button>
                          {h.status !== 'REJECTED' && (
                            <button
                              type="button"
                              onClick={() => handleRejectHotel(h.id)}
                              className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-200"
                            >
                              <XCircle className="h-3.5 w-3.5" /> Reject
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-600">
                          ✓ Live & Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Platform Users Directory ─────────────────────────────────────── */}
      <div id="users" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Ecosystem Identity & Access Control</h2>
            <p className="text-xs text-slate-500">Manage user roles, platform permissions, and security lockouts.</p>
          </div>
          <span className="text-xs text-slate-400">Showing platform key accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Organization / Context</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Access Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{u.name}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{u.hotel}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleUser(u.id)}
                      className={`text-xs font-bold hover:underline ${
                        u.status === 'ACTIVE' ? 'text-red-600' : 'text-emerald-600'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? 'Suspend Account' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── SaaS Subscriptions & Platform Commission Control ─────────────── */}
      <div id="subscriptions" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">SaaS Subscription Tiers & Platform Commission</h2>
            <p className="text-xs text-slate-500">Configure marketplace take-rate commission and active tenant subscription quotas.</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <label htmlFor="commission-rate" className="font-bold text-slate-700">Commission Rate (%):</label>
            <input
              id="commission-rate"
              type="number"
              min="2"
              max="25"
              value={commissionRate}
              onChange={(e) => {
                const v = Number(e.target.value);
                setCommissionRate(v);
                toast.success(`Platform commission rate updated to ${v}%`);
              }}
              className="w-20 rounded-xl border border-slate-200 px-3 py-1.5 font-mono font-bold text-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {[
            { name: 'Starter Plan', price: '₹2,499/mo', activeHotels: 1, limit: 'Up to 30 rooms • 5 staff' },
            { name: 'Professional Plan', price: '₹5,999/mo', activeHotels: 2, limit: 'Up to 100 rooms • AI Pricing' },
            { name: 'Business Chain', price: '₹12,999/mo', activeHotels: 1, limit: 'Unlimited rooms • Multi-property' },
          ].map((tier) => (
            <div key={tier.name} className="rounded-xl border border-slate-200 p-4 space-y-1.5 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">{tier.name}</span>
                <span className="font-mono font-extrabold text-amber-700">{tier.price}</span>
              </div>
              <p className="text-slate-500">{tier.limit}</p>
              <div className="pt-1 font-semibold text-emerald-700">{tier.activeHotels} Active Tenant(s)</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
