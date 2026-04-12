import Link from 'next/link';
import {
  Search,
  Rocket,
  Building2,
  Users,
  FileText,
  Download,
  Mail,
  Repeat,
  ListChecks,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';

const quickStart = [
  {
    icon: Rocket,
    title: 'はじめに',
    description: 'アカウント作成から最初の請求書発行までの流れを解説します。',
    href: '/help/getting-started',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Building2,
    title: '会社情報の設定',
    description: 'インボイス登録番号や銀行口座、印影などの初期設定方法。',
    href: '/help/company-settings',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: Users,
    title: '取引先の管理',
    description: '取引先の追加、担当者・メール・支払方法の登録方法。',
    href: '/help/customers',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: FileText,
    title: '請求書の作成',
    description: '品目の追加・消費税計算・発行までの一連の流れ。',
    href: '/help/invoices',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Mail,
    title: 'メール送信',
    description: 'テンプレートのカスタマイズ、プレースホルダー、送信手順。',
    href: '/help/email',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: Repeat,
    title: '定期請求',
    description: '毎月自動で請求書を生成・送信する定期請求の使い方。',
    href: '/help/recurring',
    color: 'bg-violet-50 text-violet-600',
  },
];

const allTopics = [
  { icon: Rocket, title: 'はじめに', href: '/help/getting-started' },
  { icon: Building2, title: '会社情報の設定', href: '/help/company-settings' },
  { icon: Users, title: '取引先の管理', href: '/help/customers' },
  { icon: FileText, title: '請求書の作成', href: '/help/invoices' },
  { icon: Download, title: 'PDFの出力', href: '/help/pdf' },
  { icon: Mail, title: 'メール送信', href: '/help/email' },
  { icon: Repeat, title: '定期請求', href: '/help/recurring' },
  { icon: ListChecks, title: 'ステータス管理', href: '/help/status' },
  { icon: HelpCircle, title: 'よくある質問', href: '/help/faq' },
];

export default function HelpIndexPage() {
  return (
    <div className="max-w-4xl">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          ヘルプセンター
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          請求書ナビの使い方
        </p>
      </div>

      {/* Search */}
      <div className="mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="キーワードで検索（例：メール送信、消費税、PDF）"
            className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <p className="mt-2 text-xs text-gray-400">
          検索機能は準備中です。下のカテゴリからお探しください。
        </p>
      </div>

      {/* Quick start */}
      <section className="mb-12">
        <h2 className="mb-5 text-xl font-bold text-gray-900">
          はじめに読んでおきたい記事
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickStart.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
              >
                <div
                  className={`mb-3 inline-flex rounded-lg p-2.5 ${item.color}`}
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="mb-1 text-base font-semibold text-gray-900 group-hover:text-blue-600">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* All topics */}
      <section className="mb-12">
        <h2 className="mb-5 text-xl font-bold text-gray-900">
          すべてのトピック
        </h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <ul className="divide-y divide-gray-100">
            {allTopics.map((topic) => {
              const Icon = topic.icon;
              return (
                <li key={topic.href}>
                  <Link
                    href={topic.href}
                    className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-blue-50"
                  >
                    <Icon className="size-5 flex-shrink-0 text-gray-400" />
                    <span className="flex-1 text-sm font-medium text-gray-900">
                      {topic.title}
                    </span>
                    <span className="text-xs text-gray-400">開く →</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Contact */}
      <section className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-white p-3 text-blue-600 shadow-sm">
            <MessageCircle className="size-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">
              解決しない場合はサポートへ
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              このヘルプセンターで解決しない場合は、お気軽にサポートへお問い合わせください。通常1〜2営業日以内に返信いたします。
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="mailto:support@example.com"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <Mail className="size-4" />
                メールで問い合わせ
              </a>
              <Link
                href="/help/faq"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                よくある質問を見る
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
