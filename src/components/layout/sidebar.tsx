'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FileText,
  LayoutDashboard,
  RefreshCw,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useOrg } from '@/lib/org-context';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: '\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9', icon: LayoutDashboard },
  { href: '/invoices', label: '\u8ACB\u6C42\u66F8', icon: FileText },
  { href: '/recurring', label: '\u5B9A\u671F\u8ACB\u6C42', icon: RefreshCw },
  { href: '/customers', label: '\u53D6\u5F15\u5148', icon: Building2 },
  { href: '/settings/company', label: '\u8A2D\u5B9A', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { org, userEmail, loading } = useOrg();
  const [mobileOpen, setMobileOpen] = useState(false);

  const supabase = createClient();

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [mobileOpen]);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  function isActive(href: string) {
    if (href === '/settings/company') {
      return pathname.startsWith('/settings');
    }
    return pathname === href || pathname.startsWith(href + '/');
  }

  const navContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5">
        <FileText className="size-6 text-blue-600" />
        <span className="text-lg font-bold tracking-tight">
          {'\u8ACB\u6C42\u66F8\u7BA1\u7406'}
        </span>
      </div>

      {/* Company name */}
      {!loading && org && (
        <div className="mx-4 mb-3 rounded-md bg-white px-3 py-2 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
          {org.name}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: user info + logout */}
      <div className="border-t border-gray-200 px-4 py-4">
        {userEmail && (
          <p className="mb-3 truncate text-xs text-gray-500">{userEmail}</p>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-gray-600 hover:text-gray-900"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          {'\u30ED\u30B0\u30A2\u30A6\u30C8'}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <div className="fixed top-0 left-0 z-40 flex h-14 w-full items-center border-b border-gray-200 bg-white px-4 md:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-1.5 text-gray-600 hover:bg-gray-100"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <div className="ml-3 flex items-center gap-2">
          <FileText className="size-5 text-blue-600" />
          <span className="text-sm font-bold">{'\u8ACB\u6C42\u66F8\u7BA1\u7406'}</span>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 md:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-64 flex-col bg-gray-50 shadow-xl transition-transform duration-200 ease-out md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!mobileOpen}
      >
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-gray-50 md:flex">
        {navContent}
      </aside>

      {/* Mobile top bar spacer */}
      <div className="h-14 md:hidden" />
    </>
  );
}
