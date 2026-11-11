'use client';

import React, { useState } from 'react';
import {
  BedDouble,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import { api } from '../../../src/lib/api';

export default function RoomInventoryPage() {
  const [rooms, setRooms] = useState([
    { id: 'r1', roomNumber: '101', floor: 1, category: 'Deluxe Heritage', status: 'AVAILABLE', price: 12500 },
    { id: 'r2', roomNumber: '102', floor: 1, category: 'Deluxe Heritage', status: 'CLEANING_REQUIRED', price: 12500 },
    { id: 'r3', roomNumber: '104', floor: 1, category: 'Deluxe Heritage', status: 'AVAILABLE', price: 12500 },
    { id: 'r4', roomNumber: '105', floor: 1, category: 'Standard Room', status: 'OCCUPIED', price: 7500 },
    { id: 'r5', roomNumber: '108', floor: 1, category: 'Standard Room', status: 'RESERVED', price: 7500 },
    { id: 'r6', roomNumber: '201', floor: 2, category: 'Executive Sea-Facing Suite', status: 'AVAILABLE', price: 18500 },
    { id: 'r7', roomNumber: '204', floor: 2, category: 'Executive Sea-Facing Suite', status: 'OCCUPIED', price: 18500 },
    { id: 'r8', roomNumber: '302', floor: 3, category: 'Executive Sea-Facing Suite', status: 'OCCUPIED', price: 18500 },
    { id: 'r9', roomNumber: '304', floor: 3, category: 'Deluxe Heritage', status: 'AVAILABLE', price: 12500 },
    { id: 'r10', roomNumber: '305', floor: 3, category: 'Deluxe Heritage', status: 'CLEANING_IN_PROGRESS', price: 12500 },
    { id: 'r11', roomNumber: '401', floor: 4, category: 'Presidential Royal Suite', status: 'RESERVED', price: 35000 },
    { id: 'r12', roomNumber: '402', floor: 4, category: 'Presidential Royal Suite', status: 'MAINTENANCE', price: 35000 },
  ]);

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [floorFilter, setFloorFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newFloor, setNewFloor] = useState('1');
  const [newCategory, setNewCategory] = useState('Deluxe Heritage');

  const filteredRooms = rooms.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (floorFilter !== 'ALL' && r.floor !== Number(floorFilter)) return false;
    return true;
  });

  const handleStatusChange = async (roomId: string, newStatus: string) => {
    try {
      await api.patch(`/hotels/demo/rooms/${roomId}/status`, { status: newStatus });
    } catch {}

    setRooms(
      rooms.map((r) => (r.id === roomId ? { ...r, status: newStatus } : r))
    );
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber) return;

    const newRoom = {
      id: `room-${Date.now()}`,
      roomNumber: newRoomNumber,
      floor: Number(newFloor),
      category: newCategory,
      status: 'AVAILABLE',
      price: newCategory.includes('Presidential') ? 35000 : newCategory.includes('Suite') ? 18500 : 12500,
    };

    setRooms([...rooms, newRoom]);
    setShowAddModal(false);
    setNewRoomNumber('');
    alert(`Room #${newRoomNumber} added to inventory successfully!`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Room Inventory & Status Matrix
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl mt-0.5">
            Rooms & Availability Grid
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage room allocations, floor plans, maintenance blocks, and live housekeeping states.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Room</span>
        </button>
      </div>

      {/* ─── Filters Bar ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-xs font-semibold">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 mr-1 uppercase text-[10px] font-bold">Status:</span>
          {[
            { label: 'All (12)', value: 'ALL' },
            { label: 'Available (5)', value: 'AVAILABLE' },
            { label: 'Occupied (3)', value: 'OCCUPIED' },
            { label: 'Reserved (2)', value: 'RESERVED' },
            { label: 'Cleaning (2)', value: 'CLEANING_REQUIRED' },
            { label: 'Maintenance (1)', value: 'MAINTENANCE' },
          ].map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === s.value
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Floor Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 uppercase text-[10px] font-bold">Floor:</span>
          <select
            value={floorFilter}
            onChange={(e) => setFloorFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Floors</option>
            <option value="1">Floor 1</option>
            <option value="2">Floor 2</option>
            <option value="3">Floor 3</option>
            <option value="4">Floor 4</option>
          </select>
        </div>
      </div>

      {/* ─── Room Cards Matrix Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredRooms.map((room) => {
          let statusColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
          if (room.status === 'OCCUPIED') statusColor = 'bg-red-100 text-red-800 border-red-200';
          if (room.status === 'RESERVED') statusColor = 'bg-blue-100 text-blue-800 border-blue-200';
          if (room.status.includes('CLEANING')) statusColor = 'bg-amber-100 text-amber-800 border-amber-200';
          if (room.status === 'MAINTENANCE') statusColor = 'bg-slate-200 text-slate-800 border-slate-300';

          return (
            <div
              key={room.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between transition-all hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Floor {room.floor}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${statusColor}`}
                  >
                    {room.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="mt-2">
                  <h3 className="text-2xl font-black text-slate-900">#{room.roomNumber}</h3>
                  <p className="text-xs font-medium text-slate-600 mt-0.5">{room.category}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400">Nightly Rate</span>
                  <div className="text-sm font-extrabold text-slate-900">
                    ₹{room.price.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Status Toggle Action */}
                <select
                  value={room.status}
                  onChange={(e) => handleStatusChange(room.id, e.target.value)}
                  className="text-[11px] font-bold rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-slate-700 focus:outline-none"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="OCCUPIED">Occupied</option>
                  <option value="RESERVED">Reserved</option>
                  <option value="CLEANING_REQUIRED">Clean Needed</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Add Room Modal ────────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Add Room to Property</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRoom} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">Room Number</label>
                <input
                  type="text"
                  placeholder="e.g. 501"
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Floor Level</label>
                  <select
                    value={newFloor}
                    onChange={(e) => setNewFloor(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="1">Floor 1</option>
                    <option value="2">Floor 2</option>
                    <option value="3">Floor 3</option>
                    <option value="4">Floor 4</option>
                    <option value="5">Floor 5</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Standard Room">Standard Room</option>
                    <option value="Deluxe Heritage">Deluxe Heritage</option>
                    <option value="Executive Sea-Facing Suite">Executive Suite</option>
                    <option value="Presidential Royal Suite">Presidential Suite</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-amber-700"
                >
                  Save to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
