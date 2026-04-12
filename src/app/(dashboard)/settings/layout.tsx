'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const settingsNav = [
  { href: '/settings/company', label: '\u4F1A\u793E\u60C5\u5831' },
  { href: '/settings/invoice', label: '\u8ACB\u6C42\u66F8\u8A2D\u5B9A' },
  { href: '/settings/email', label: '\u30E1\u30FC\u30EB\u9001\u4FE1' },
  { href: '/settings/members', label: '\u30E1\u30F3\u30D0\u30FC' },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{'\u8A2D\u5B9A'}</h1>

      {/* Tab-style sub-navigation */}
      <div className="mb-6 -mx-4 overflow-x-auto border-b border-gray-200 sm:mx-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-1 px-4 sm:px-0">
          {settingsNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  active
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {children}
    </div>
  );
}
