import React from 'react';
import { HotelSidebar } from '../../src/components/layout/hotel-sidebar';

export default function HotelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <HotelSidebar />
      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}

