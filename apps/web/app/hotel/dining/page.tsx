'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  UtensilsCrossed,
  Plus,
  CheckCircle2,
  Soup,
} from 'lucide-react';

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface KotOrder {
  id: string;
  ticketNo: string;
  roomNumber: string;
  guestName: string;
  items: OrderItem[];
  total: number;
  status: 'PENDING' | 'PREPARING' | 'READY_FOR_DELIVERY' | 'DELIVERED';
  orderTime: string;
  specialInstructions?: string;
  billedToRoom: boolean;
}

export default function HotelDiningPOSPage() {
  const [activeTab, setActiveTab] = useState<'KOT' | 'MENU'>('KOT');

  const [orders, setOrders] = useState<KotOrder[]>([
    {
      id: 'kot-101',
      ticketNo: 'KOT #1084',
      roomNumber: '204',
      guestName: 'Dr. Anita Roy',
      items: [
        { name: 'Paneer Butter Masala', qty: 1, price: 550 },
        { name: 'Butter Garlic Naan (2 pcs)', qty: 2, price: 300 },
        { name: 'Fresh Lime Soda (Sweet)', qty: 1, price: 180 },
      ],
      total: 1030,
      status: 'PREPARING',
      orderTime: '12:42 PM (18m ago)',
      specialInstructions: 'Less spicy, serve extra lime wedge',
      billedToRoom: true,
    },
    {
      id: 'kot-102',
      ticketNo: 'KOT #1085',
      roomNumber: '401',
      guestName: 'Mrs. Kavita Iyer (VIP)',
      items: [
        { name: 'Club Chicken Sandwich', qty: 2, price: 900 },
        { name: 'Cold Pressed Orange Juice', qty: 2, price: 440 },
        { name: 'Warm Chocolate Brownie with Vanilla Gelato', qty: 1, price: 380 },
      ],
      total: 1720,
      status: 'PENDING',
      orderTime: '12:55 PM (5m ago)',
      specialInstructions: 'Gluten-free bread if available',
      billedToRoom: true,
    },
    {
      id: 'kot-103',
      ticketNo: 'KOT #1083',
      roomNumber: '302',
      guestName: 'Rohan Deshmukh',
      items: [
        { name: 'Filter Coffee Pot (2 cups)', qty: 1, price: 220 },
        { name: 'Assorted Bakery Basket', qty: 1, price: 350 },
      ],
      total: 570,
      status: 'READY_FOR_DELIVERY',
      orderTime: '12:30 PM (30m ago)',
      billedToRoom: true,
    },
  ]);

  const menuItems = [
    { id: 'm1', name: 'Dal Makhani Heritage', category: 'Indian Mains', price: 480, veg: true, desc: 'Slow simmered 24-hr black lentils with churned white butter' },
    { id: 'm2', name: 'Murgh Tikka Masala', category: 'Indian Mains', price: 620, veg: false, desc: 'Clay oven charred chicken tikka in velvet spiced tomato gravy' },
    { id: 'm3', name: 'Artisan Club Sandwich', category: 'All Day Bites', price: 450, veg: false, desc: 'Triple decker smoked chicken, crisp greens, and herb mayo' },
    { id: 'm4', name: 'Paneer Tikka Shashlik', category: 'Starters', price: 520, veg: true, desc: 'Tandoor-roasted cottage cheese with bell peppers and mint dip' },
    { id: 'm5', name: 'Classic Mumbai Cutting Chai & Pakoras', category: 'Beverages', price: 260, veg: true, desc: 'Ginger-cardamom tea kettle with crispy onion fritters' },
    { id: 'm6', name: 'Belgian Truffle Chocolate Cake', category: 'Desserts', price: 380, veg: true, desc: 'Warm 70% dark chocolate ganache with raspberry coulis' },
  ];

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('204');
  const [selectedItemName, setSelectedItemName] = useState('Dal Makhani Heritage');
  const [quantity, setQuantity] = useState('1');
  const [orderNotes, setOrderNotes] = useState('');

  // Advance KOT Status
  const advanceKotStatus = (orderId: string, current: string) => {
    let next: KotOrder['status'] = 'PREPARING';
    if (current === 'PENDING') next = 'PREPARING';
    else if (current === 'PREPARING') next = 'READY_FOR_DELIVERY';
    else if (current === 'READY_FOR_DELIVERY') next = 'DELIVERED';

    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: next } : o))
    );
    toast.success(`Kitchen ticket updated to ${next.replace(/_/g, ' ')}`);
  };

  // Submit New Order
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const item = menuItems.find((m) => m.name === selectedItemName);
    const itemPrice = item ? item.price : 450;
    const qty = Number(quantity) || 1;
    const total = itemPrice * qty;

    const newKot: KotOrder = {
      id: `kot-${Date.now()}`,
      ticketNo: `KOT #${Math.floor(1086 + Math.random() * 50)}`,
      roomNumber: selectedRoom,
      guestName: selectedRoom === '204' ? 'Dr. Anita Roy' : selectedRoom === '401' ? 'Mrs. Kavita Iyer' : 'In-House Guest',
      items: [{ name: selectedItemName, qty, price: itemPrice }],
      total,
      status: 'PENDING',
      orderTime: 'Just now',
      specialInstructions: orderNotes || undefined,
      billedToRoom: true,
    };

    setOrders([newKot, ...orders]);
    setShowOrderModal(false);
    setOrderNotes('');
    toast.success(`Order ${newKot.ticketNo} sent to Kitchen for Room #${selectedRoom} (₹${total})`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Food & Beverage • In-Room Dining & Restaurant POS
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl mt-0.5">
            Kitchen Order Tickets (KOT) & Dining
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time live kitchen dispatch board, automated guest room folio billing, and interactive digital menus.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOrderModal(true)}
            className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create In-Room Dining Order</span>
          </button>
        </div>
      </div>

      {/* ─── View Switcher Tabs ────────────────────────────────────────────── */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('KOT')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'KOT'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UtensilsCrossed className="h-4 w-4" />
          <span>Live Kitchen Board ({orders.length} Active Tickets)</span>
        </button>

        <button
          onClick={() => setActiveTab('MENU')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'MENU'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Soup className="h-4 w-4" />
          <span>Dining Menu & Pricing ({menuItems.length} Items)</span>
        </button>
      </div>

      {/* ─── TAB 1: Live Kitchen Order Tickets ─────────────────────────────── */}
      {activeTab === 'KOT' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {orders.map((order) => {
            const isDelivered = order.status === 'DELIVERED';
            return (
              <div
                key={order.id}
                className={`rounded-2xl border bg-white p-5 shadow-sm space-y-4 transition-all ${
                  order.status === 'PENDING'
                    ? 'border-amber-300 ring-2 ring-amber-400/20'
                    : order.status === 'PREPARING'
                    ? 'border-blue-300'
                    : order.status === 'READY_FOR_DELIVERY'
                    ? 'border-purple-300 bg-purple-50/20'
                    : 'border-slate-200 opacity-60'
                }`}
              >
                {/* Header Ticket Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono text-xs font-black text-slate-900">{order.ticketNo}</span>
                    <div className="text-[11px] text-slate-400">{order.orderTime}</div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-black bg-amber-100 text-amber-800">
                      Room #{order.roomNumber}
                    </span>
                    <div className="text-[11px] font-medium text-slate-600 mt-0.5">{order.guestName}</div>
                  </div>
                </div>

                {/* Items Ordered */}
                <div className="space-y-1.5 text-xs">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-slate-800">
                      <span>
                        <strong className="text-amber-700">{item.qty}x</strong> {item.name}
                      </span>
                      <span className="font-mono font-medium text-slate-600">
                        ₹{(item.price * item.qty).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Special Cooking Note */}
                {order.specialInstructions && (
                  <div className="rounded-xl bg-slate-50 p-2.5 text-[11px] text-slate-600 border border-slate-100">
                    <span className="font-bold text-slate-800">Chef Note:</span> {order.specialInstructions}
                  </div>
                )}

                {/* Billing Summary & Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Folio Charge</span>
                    <span className="text-sm font-extrabold text-slate-900">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {!isDelivered ? (
                    <button
                      onClick={() => advanceKotStatus(order.id, order.status)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm transition-colors ${
                        order.status === 'PENDING'
                          ? 'bg-amber-600 hover:bg-amber-700'
                          : order.status === 'PREPARING'
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      {order.status === 'PENDING' && 'Start Cooking →'}
                      {order.status === 'PREPARING' && 'Ready to Serve →'}
                      {order.status === 'READY_FOR_DELIVERY' && 'Mark Delivered ✓'}
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Delivered & Billed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── TAB 2: Dining Menu Catalog ───────────────────────────────────── */}
      {activeTab === 'MENU' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                </div>
                <span className="text-sm font-black text-slate-900">₹{item.price}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.veg ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {item.veg ? '● PURE VEG' : '▲ NON-VEG'}
                </span>
                <button
                  onClick={() => {
                    setSelectedItemName(item.name);
                    setShowOrderModal(true);
                  }}
                  className="text-xs font-bold text-amber-600 hover:underline"
                >
                  Quick Order →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Create In-Room Order Modal ─────────────────────────────────────── */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">New Room Service KOT</h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Deliver to Room Number
                </label>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-900"
                >
                  <option value="204">Room #204 — Dr. Anita Roy (Deluxe)</option>
                  <option value="401">Room #401 — Mrs. Kavita Iyer (Presidential)</option>
                  <option value="302">Room #302 — Rohan Deshmukh (Executive)</option>
                  <option value="105">Room #105 — Siddharth Sen (Standard)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Menu Item Selection
                </label>
                <select
                  value={selectedItemName}
                  onChange={(e) => setSelectedItemName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900"
                >
                  {menuItems.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} — ₹{m.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Special Chef Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Mild spice, no onions, extra cutlery"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-900 border border-amber-200/60">
                <span className="font-bold block">Folio Auto-Charge:</span>
                This charge will automatically post to the guest's folio invoice and settle at checkout.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-amber-600 py-2.5 font-bold text-white hover:bg-amber-700"
                >
                  Send to Kitchen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

