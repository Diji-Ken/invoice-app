import Link from 'next/link';
import { FileText } from 'lucide-react';

const tocItems = [
  { href: '/help/getting-started', label: 'はじめに' },
  { href: '/help/company-settings', label: '会社情報の設定' },
  { href: '/help/customers', label: '取引先の管理' },
  { href: '/help/invoices', label: '請求書の作成' },
  { href: '/help/pdf', label: 'PDFの出力' },
  { href: '/help/email', label: 'メール送信' },
  { href: '/help/email-setup', label: 'メール送信設定' },
  { href: '/help/recurring', label: '定期請求' },
  { href: '/help/status', label: 'ステータス管理' },
  { href: '/help/faq', label: 'よくある質問' },
];

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="size-6 text-blue-600" />
            <span className="text-lg font-bold tracking-tight text-gray-900">
              請求書ナビ
            </span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-3">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              ホーム
            </Link>
            <Link
              href="/help"
              aria-current="page"
              className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600"
            >
              ヘルプ
            </Link>
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              className="hidden rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:inline-block"
            >
              無料で始める
            </Link>
          </nav>
        </div>
      </header>

      {/* Main: sidebar + content */}
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 lg:flex-row">
        {/* Mobile TOC (non-sticky list shown at top on small screens) */}
        <details className="lg:hidden">
          <summary className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900">
            目次を表示
          </summary>
          <nav className="mt-2 space-y-1 rounded-lg border border-gray-100 bg-white p-3 text-sm">
            {tocItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded px-2 py-1.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </details>

        {/* Desktop sidebar */}
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <div className="sticky top-24">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              目次
            </h2>
            <nav className="space-y-1 text-sm">
              {tocItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded px-2 py-1.5 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 rounded-lg border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-semibold text-blue-900">
                解決しない場合は
              </p>
              <p className="mt-1 text-xs leading-relaxed text-blue-800">
                お問い合わせフォームからサポートへご連絡ください。
              </p>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 px-6 py-8">
        <div className="mx-auto max-w-6xl text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} 請求書ナビ
        </div>
      </footer>
    </div>
  );
}
