import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../src/components/layout/navbar';
import { Footer } from '../src/components/layout/footer';

export const metadata: Metadata = {
  title: 'HOTEL OS — Enterprise Hotel Management & Booking SaaS Ecosystem',
  description:
    'Complete multi-tenant hospitality operating system. Direct customer booking engine, front-desk PMS, housekeeping workflows, and AI revenue optimization.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-amber-100 selection:text-amber-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
