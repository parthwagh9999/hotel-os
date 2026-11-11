'use client';

import React, { useState } from 'react';
import {
  IndianRupee,
  Receipt,
  Download,
  Plus,
  TrendingUp,
  CreditCard,
  Building,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';

export default function HotelFinancePage() {
  const [invoices] = useState([
    { number: 'INV-2025-001', guest: 'Dr. Anita Roy', amount: 42000, tax: 4500, date: '11 Jun 2025', status: 'PAID' },
    { number: 'INV-2025-002', guest: 'Rohan Deshmukh', amount: 62160, tax: 6660, date: '10 Jun 2025', status: 'PAID' },
    { number: 'INV-2025-003', guest: 'Siddharth Sen', amount: 20160, tax: 2160, date: '09 Jun 2025', status: 'PAID' },
    { number: 'INV-2025-004', guest: 'Kavita Iyer', amount: 117600, tax: 12600, date: '08 Jun 2025', status: 'PAID' },
  ]);

  const [expenses, setExpenses] = useState([
    { id: 'e1', category: 'Linen & Laundry', desc: 'Commercial laundry washing & pressing', amount: 24500, date: '10 Jun' },
    { id: 'e2', category: 'Food & Beverage', desc: 'Breakfast dairy and organic produce supplier', amount: 48000, date: '08 Jun' },
    { id: 'e3', category: 'Utilities', desc: 'High-speed fiber internet and electric bill', amount: 35000, date: '05 Jun' },
  ]);

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseCategory, setExpenseCategory] = useState('Linen & Laundry');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  const totalRevenue = 3450000;
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0) + 450000;
  const netProfit = totalRevenue - totalExpenses;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseAmount) return;

    setExpenses([
      {
        id: `exp-${Date.now()}`,
        category: expenseCategory,
        desc: expenseDesc || 'Operational vendor settlement',
        amount: Number(expenseAmount),
        date: 'Today',
      },
      ...expenses,
    ]);

    setShowAddExpense(false);
    setExpenseAmount('');
    setExpenseDesc('');
    alert('Expense recorded into hotel ledger!');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Financial Management & Accounting
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl mt-0.5">
            Revenue, Invoicing & GST Compliance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-ready revenue reconciliation, multi-tier GST tax reporting, supplier payments, and exportable invoices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Exporting full financial ledger as CSV / Excel format...')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddExpense(true)}
            className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-700"
          >
            <Plus className="h-4 w-4" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* ─── Financial KPI Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400">Total Monthly GMV Revenue</span>
          <div className="text-3xl font-extrabold text-slate-900">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> +14.2% higher vs previous month
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400">Monthly Operating Expenses</span>
          <div className="text-3xl font-extrabold text-slate-900">
            ₹{totalExpenses.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-slate-500">Utilities, Linen, F&B, Staff payroll</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400">Net Operating Profit</span>
          <div className="text-3xl font-extrabold text-emerald-600">
            ₹{netProfit.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-emerald-700 font-semibold">83.8% Operating Margin</span>
        </div>
      </div>

      {/* ─── Indian GST Tax Reporting Matrix ───────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">GST Slab Tax Calculations (India Compliance)</h2>
            <p className="text-xs text-slate-500">Automated slab rates applied per night as mandated by tax authorities.</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            GSTIN: 27AABCT2345Z1Z8
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="font-bold text-slate-800">0% GST Slab (₹0 - ₹1,000)</div>
            <p className="text-slate-500">Dormitories & Budget Rooms</p>
            <div className="pt-2 font-mono font-bold text-slate-900">Total Tax: ₹0</div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/50 space-y-1">
            <div className="font-bold text-amber-900">12% GST Slab (₹1,001 - ₹7,500)</div>
            <p className="text-slate-500">Standard Rooms (₹7,500 rate)</p>
            <div className="pt-2 font-mono font-bold text-slate-900">Tax Collected: ₹38,400</div>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200/50 space-y-1">
            <div className="font-bold text-purple-900">18% GST Slab (&gt; ₹7,500)</div>
            <p className="text-slate-500">Deluxe Heritage & Luxury Suites</p>
            <div className="pt-2 font-mono font-bold text-slate-900">Tax Collected: ₹248,000</div>
          </div>
        </div>
      </div>

      {/* ─── Recent Invoices Table ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Issued GST Invoices</h2>
          <span className="text-xs text-slate-400">Showing last 4 transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">GST Included</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">PDF Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {invoices.map((inv) => (
                <tr key={inv.number} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.number}</td>
                  <td className="py-3 px-4 font-medium">{inv.guest}</td>
                  <td className="py-3 px-4 text-slate-500">{inv.date}</td>
                  <td className="py-3 px-4 font-mono">₹{inv.tax.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 font-mono font-extrabold text-slate-900">
                    ₹{inv.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4">
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => alert(`Downloading official PDF for ${inv.number}...`)}
                      className="inline-flex items-center gap-1 text-amber-600 font-bold hover:underline"
                    >
                      <Download className="h-3.5 w-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Record Expense Modal ───────────────────────────────────────────── */}
      {showAddExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Record Business Expense</h3>
              <button onClick={() => setShowAddExpense(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">Expense Category</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Linen & Laundry">Linen & Laundry</option>
                  <option value="Food & Beverage">Food & Beverage (F&B)</option>
                  <option value="Utilities">Utilities & Electricity</option>
                  <option value="Maintenance">Maintenance & Repairs</option>
                  <option value="Software & OTA">Software & Technology</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Description / Vendor</label>
                <input
                  type="text"
                  placeholder="e.g. Commercial linen dry-clean invoice"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-amber-700"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
