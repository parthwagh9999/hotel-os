import React from 'react';
import { AdminSidebar } from '../../src/components/layout/admin-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}
