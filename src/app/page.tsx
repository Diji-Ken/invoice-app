import Link from 'next/link';
import { FileText, Download, Send } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="size-6 text-blue-600" />
            <span className="text-lg font-bold tracking-tight">
              {'\u8ACB\u6C42\u66F8\u7BA1\u7406'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              {'\u30ED\u30B0\u30A4\u30F3'}
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              {'\u7121\u6599\u3067\u59CB\u3081\u308B'}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl">
          {'\u8ACB\u6C42\u66F8\u7BA1\u7406'}
        </h1>
        <p className="mt-4 max-w-lg text-lg text-gray-500">
          {'\u30B7\u30F3\u30D7\u30EB\u3067\u7F8E\u3057\u3044\u8ACB\u6C42\u66F8\u4F5C\u6210\u30B5\u30FC\u30D3\u30B9'}
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            {'\u7121\u6599\u3067\u59CB\u3081\u308B'}
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            {'\u30ED\u30B0\u30A4\u30F3'}
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-gray-900">
            {'\u4E3B\u306A\u6A5F\u80FD'}
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: FileText,
                title: '\u7C21\u5358\u4F5C\u6210',
                description:
                  '\u30D5\u30A9\u30FC\u30E0\u306B\u5165\u529B\u3059\u308B\u3060\u3051\u3067\u3001\u30D7\u30ED\u30D5\u30A7\u30C3\u30B7\u30E7\u30CA\u30EB\u306A\u8ACB\u6C42\u66F8\u3092\u4F5C\u6210\u3067\u304D\u307E\u3059\u3002',
              },
              {
                icon: Download,
                title: 'PDF\u51FA\u529B',
                description:
                  '\u30EF\u30F3\u30AF\u30EA\u30C3\u30AF\u3067\u7F8E\u3057\u3044PDF\u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u3002\u8907\u6570\u306E\u30C7\u30B6\u30A4\u30F3\u304B\u3089\u9078\u3079\u307E\u3059\u3002',
              },
              {
                icon: Send,
                title: '\u81EA\u52D5\u9001\u4FE1',
                description:
                  '\u5B9A\u671F\u8ACB\u6C42\u3084\u30E1\u30FC\u30EB\u9001\u4FE1\u3092\u81EA\u52D5\u5316\u3002\u8ACB\u6C42\u696D\u52D9\u3092\u52B9\u7387\u5316\u3057\u307E\u3059\u3002',
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-gray-200 bg-white p-6"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3">
                    <Icon className="size-5 text-blue-600" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="mx-auto max-w-5xl text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} {'\u8ACB\u6C42\u66F8\u7BA1\u7406'}
        </div>
      </footer>
    </div>
  );
}
