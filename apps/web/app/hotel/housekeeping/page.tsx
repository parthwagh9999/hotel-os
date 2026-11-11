'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CheckSquare,
  Square,
  ShieldCheck,
  User,
  Filter,
} from 'lucide-react';
import { api } from '../../../src/lib/api';

export default function HousekeepingPage() {
  const [tasks, setTasks] = useState([
    {
      id: 'hk-1',
      roomNumber: '102',
      floor: 1,
      type: 'CHECKOUT_CLEAN',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      assignedTo: 'Sunita Sharma',
      checklist: [
        { item: 'Strip and replace bed linens', completed: true },
        { item: 'Deep disinfect bathroom & fixtures', completed: true },
        { item: 'Inspect for guest lost-and-found', completed: false },
        { item: 'Vacuum carpets and mop floors', completed: false },
        { item: 'Restock amenities and water bottles', completed: false },
      ],
    },
    {
      id: 'hk-2',
      roomNumber: '204',
      floor: 2,
      type: 'CHECKOUT_CLEAN',
      priority: 'URGENT',
      status: 'ASSIGNED',
      assignedTo: 'Ramesh Pawar',
      checklist: [
        { item: 'Strip and replace bed linens', completed: false },
        { item: 'Deep disinfect bathroom & fixtures', completed: false },
        { item: 'Restock amenities and tea kit', completed: false },
      ],
    },
    {
      id: 'hk-3',
      roomNumber: '305',
      floor: 3,
      type: 'STAY_CLEAN',
      priority: 'MEDIUM',
      status: 'COMPLETED',
      assignedTo: 'Pooja Verma',
      checklist: [
        { item: 'Make bed with fresh top sheet', completed: true },
        { item: 'Wipe bathroom surfaces', completed: true },
        { item: 'Empty dustbins & replace liners', completed: true },
      ],
    },
  ]);

  const [activeFloor, setActiveFloor] = useState<number | 'ALL'>('ALL');

  // Toggle checklist item
  const toggleChecklistItem = (taskId: string, index: number) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          const updated = [...t.checklist];
          updated[index].completed = !updated[index].completed;
          return { ...t, checklist: updated };
        }
        return t;
      })
    );
  };

  // Move status workflow
  const advanceStatus = async (taskId: string, currentStatus: string) => {
    let nextStatus = 'ASSIGNED';
    if (currentStatus === 'ASSIGNED') nextStatus = 'IN_PROGRESS';
    else if (currentStatus === 'IN_PROGRESS') nextStatus = 'COMPLETED';
    else if (currentStatus === 'COMPLETED') nextStatus = 'INSPECTED';

    try {
      await api.patch(`/hotels/demo/housekeeping/tasks/${taskId}/status`, {
        status: nextStatus,
      });
    } catch {
      // client update
    }

    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );

    if (nextStatus === 'INSPECTED') {
      alert(`Room inspected and marked as AVAILABLE in inventory!`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Housekeeping Management & Inspection
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl mt-0.5">
            Housekeeping Operations & Cleanliness Board
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Mobile-friendly cleaning assignments, live checklists, inspection workflow, and room turnaround tracking.
          </p>
        </div>

        {/* Floor Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-sm text-xs font-semibold">
          {['ALL', 1, 2, 3, 4].map((f) => (
            <button
              key={f.toString()}
              onClick={() => setActiveFloor(f as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeFloor === f
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f === 'ALL' ? 'All Floors' : `Floor ${f}`}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Tasks Grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tasks
          .filter((t) => (activeFloor === 'ALL' ? true : t.floor === activeFloor))
          .map((task) => {
            const completedCount = task.checklist.filter((c) => c.completed).length;
            const totalCount = task.checklist.length;
            const pct = Math.round((completedCount / totalCount) * 100);

            return (
              <div
                key={task.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Floor {task.floor}
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-900">
                        Room #{task.roomNumber}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          task.priority === 'URGENT'
                            ? 'bg-red-100 text-red-800'
                            : task.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {task.priority}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1 capitalize">
                        {task.type.replace('_', ' ').toLowerCase()}
                      </p>
                    </div>
                  </div>

                  {/* Staff Assignee */}
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      {task.assignedTo}
                    </span>
                    <span
                      className={`font-bold text-[11px] ${
                        task.status === 'COMPLETED'
                          ? 'text-purple-600'
                          : task.status === 'INSPECTED'
                          ? 'text-emerald-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                      <span>Checklist Progress</span>
                      <span>{completedCount}/{totalCount} ({pct}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Checklist Items */}
                  <div className="mt-4 space-y-2">
                    {task.checklist.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleChecklistItem(task.id, idx)}
                        className="w-full flex items-center gap-2 text-left text-xs p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        {item.completed ? (
                          <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Square className="h-4 w-4 text-slate-300 shrink-0" />
                        )}
                        <span
                          className={
                            item.completed
                              ? 'text-slate-400 line-through'
                              : 'text-slate-700'
                          }
                        >
                          {item.item}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Workflow Transition Action */}
                <div className="mt-6 border-t border-slate-100 pt-4">
                  {task.status === 'ASSIGNED' && (
                    <button
                      onClick={() => advanceStatus(task.id, task.status)}
                      className="w-full rounded-xl bg-amber-600 py-2.5 text-xs font-bold text-white shadow hover:bg-amber-700"
                    >
                      Start Cleaning Room
                    </button>
                  )}
                  {task.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => advanceStatus(task.id, task.status)}
                      className="w-full rounded-xl bg-purple-600 py-2.5 text-xs font-bold text-white shadow hover:bg-purple-700"
                    >
                      Mark Cleaning Completed
                    </button>
                  )}
                  {task.status === 'COMPLETED' && (
                    <button
                      onClick={() => advanceStatus(task.id, task.status)}
                      className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-700 flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Pass Inspection & Make Available</span>
                    </button>
                  )}
                  {task.status === 'INSPECTED' && (
                    <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Inspected & Available</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

