import Link from 'next/link';
import {
  FileText,
  Download,
  Mail,
  RefreshCw,
  Users,
  ShieldCheck,
  ArrowRight,
  Check,
  Sparkles,
  Zap,
  Clock,
  CreditCard,
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: '簡単作成',
    description: '直感的なフォームで請求書を5分で作成。初めての方でも迷わず入力できます。',
  },
  {
    icon: Download,
    title: 'PDF自動生成',
    description: 'プロフェッショナルなデザインのPDFを自動生成。ダウンロードも1クリックで完了。',
  },
  {
    icon: Mail,
    title: 'メール自動送信',
    description: '取引先にPDFを添付してワンクリックで送信。送信履歴も自動で記録されます。',
  },
  {
    icon: RefreshCw,
    title: '定期請求',
    description: '毎月の請求を自動化。作業時間を削減し、請求漏れも防止できます。',
  },
  {
    icon: Users,
    title: '取引先管理',
    description: '顧客情報を一元管理。過去の請求履歴もすぐに確認できます。',
  },
  {
    icon: ShieldCheck,
    title: 'インボイス制度対応',
    description: '登録番号・適格請求書に完全対応。税率計算も自動で正確に行います。',
  },
] as const;

const steps = [
  {
    number: '01',
    icon: Sparkles,
    title: 'アカウント作成',
    description: 'メールアドレスだけで30秒で登録完了。クレジットカードは不要です。',
  },
  {
    number: '02',
    icon: FileText,
    title: '会社情報を入力',
    description: '一度だけ自社情報を登録。ロゴや銀行口座も保存できます。',
  },
  {
    number: '03',
    icon: Zap,
    title: '請求書を作成・送信',
    description: '取引先を選んで明細を入力するだけ。PDF生成からメール送信までワンストップ。',
  },
] as const;

const faqs = [
  {
    question: '無料で使えますか？',
    answer:
      'はい、基本機能は無料でご利用いただけます。クレジットカード登録も不要なので、今すぐお試しいただけます。請求書の作成・PDF出力・メール送信まで、すべて無料プランに含まれています。',
  },
  {
    question: 'インボイス制度に対応していますか？',
    answer:
      '完全対応しています。適格請求書発行事業者の登録番号の表示、消費税率（8%・10%）ごとの区分記載、税率ごとの対象合計額の記載など、インボイス制度で求められる要件をすべて自動で満たします。',
  },
  {
    question: 'メール送信の設定は必要ですか？',
    answer:
      '特別な設定は不要です。請求書ナビが標準でメール送信機能を提供しているため、SMTPサーバーの用意などは必要ありません。お客様のメールアドレスから送信されたかのように、取引先にPDF付きメールをお届けします。',
  },
  {
    question: '既存データの移行はできますか？',
    answer:
      '取引先情報のCSVインポートに対応しています。他のサービスからの乗り換えもスムーズに行えます。詳細な手順はヘルプページをご覧いただくか、お問い合わせください。',
  },
  {
    question: '解約はいつでもできますか？',
    answer:
      'はい、いつでも解約可能です。最低利用期間や解約手数料はございません。ダッシュボードの設定画面からワンクリックで解約手続きができます。',
  },
  {
    question: 'サポートはありますか？',
    answer:
      'ヘルプページで操作方法をまとめているほか、メールでのお問い合わせにも対応しています。お困りの際はお気軽にご連絡ください。',
  },
] as const;

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100/80 bg-white/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm">
              <FileText className="size-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">請求書ナビ</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              機能
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              料金
            </Link>
            <Link
              href="/help"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              ヘルプ
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              お問い合わせ
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:inline-flex"
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
            >
              無料で始める
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[1200px] -translate-x-1/2 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-transparent blur-3xl" />
            <div className="absolute top-20 right-0 -z-10 size-72 rounded-full bg-blue-100/40 blur-3xl" />
            <div className="absolute top-40 left-10 -z-10 size-72 rounded-full bg-indigo-100/40 blur-3xl" />
          </div>

          <div className="mx-auto max-w-6xl px-4 pt-12 pb-20 sm:px-6 sm:pt-20 sm:pb-28 lg:pt-28">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Hero Text */}
              <div className="text-center lg:text-left">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur">
                  <Sparkles className="size-3.5" />
                  インボイス制度対応・無料で始められます
                </div>

                <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                  請求書業務を、
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    もっとシンプルに。
                  </span>
                </h1>

                <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg lg:mx-0">
                  作成から送信、定期請求の自動化まで。
                  <br className="hidden sm:inline" />
                  中小企業・フリーランスのための、シンプルで美しい請求書SaaS。
                </p>

                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <Link
                    href="/signup"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 sm:w-auto"
                  >
                    無料で始める
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="#features"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-7 py-3.5 text-base font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 sm:w-auto"
                  >
                    機能を見る
                  </Link>
                </div>

                {/* Trust indicators */}
                <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-500 lg:justify-start">
                  <li className="inline-flex items-center gap-1.5">
                    <Check className="size-4 text-green-600" />
                    クレジットカード不要
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <Check className="size-4 text-green-600" />
                    すぐに使える
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <Check className="size-4 text-green-600" />
                    インボイス制度対応
                  </li>
                </ul>
              </div>

              {/* Hero Visual: Mock Invoice Card */}
              <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
                {/* Backdrop card */}
                <div className="absolute inset-0 translate-x-4 translate-y-4 rotate-3 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100" />

                {/* Main invoice card */}
                <div className="relative rotate-[-1.5deg] rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl shadow-blue-900/10 sm:p-8">
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <div className="mb-1 inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                        <FileText className="size-3" />
                        INVOICE
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight">請求書</h3>
                      <p className="mt-0.5 font-mono text-xs text-gray-500">INV-2026-0042</p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <p>発行日: 2026/04/12</p>
                      <p>支払期限: 2026/04/30</p>
                    </div>
                  </div>

                  <div className="mb-5 rounded-lg bg-gray-50 p-3 text-xs">
                    <p className="mb-0.5 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                      請求先
                    </p>
                    <p className="font-semibold text-gray-900">株式会社サンプル 御中</p>
                    <p className="text-gray-500">担当: 山田 太郎 様</p>
                  </div>

                  <div className="mb-4 space-y-2.5 border-y border-gray-100 py-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">DXコンサルティング</span>
                      <span className="font-mono font-medium text-gray-900">¥300,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Webアプリ開発</span>
                      <span className="font-mono font-medium text-gray-900">¥200,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">運用保守費</span>
                      <span className="font-mono font-medium text-gray-900">¥50,000</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>小計</span>
                      <span className="font-mono">¥550,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>消費税 (10%)</span>
                      <span className="font-mono">¥55,000</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-sm font-semibold text-gray-700">合計金額</span>
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text font-mono text-2xl font-bold tracking-tight text-transparent">
                      ¥605,000
                    </span>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-3 -right-3 hidden rotate-6 rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-xl sm:flex sm:items-center sm:gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-green-50">
                    <Check className="size-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                      送信完了
                    </p>
                    <p className="text-xs font-semibold text-gray-900">PDF添付済</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Stats */}
        <section className="border-y border-gray-100 bg-gray-50/50">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
              <div>
                <p className="text-2xl font-bold text-gray-900 sm:text-3xl">5分</p>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">請求書作成時間</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 sm:text-3xl">¥0</p>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">初期費用</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 sm:text-3xl">100%</p>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">インボイス対応</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 sm:text-3xl">24/7</p>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">いつでも利用可能</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="scroll-mt-20 bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold tracking-wider text-blue-600 uppercase">
                Features
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                請求業務に必要な機能を、すべて。
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
                作成から送信、管理まで。請求書ナビひとつで完結します。
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5"
                  >
                    <div className="mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 transition-transform group-hover:scale-110">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Product Showcase */}
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold tracking-wider text-blue-600 uppercase">
                Product
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                美しく、わかりやすいダッシュボード
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
                一目で状況を把握。作業はすべてワンクリックで。
              </p>
            </div>

            {/* Mock Dashboard */}
            <div className="mt-14">
              <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-blue-900/10">
                {/* Browser bar */}
                <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="size-3 rounded-full bg-red-400" />
                    <div className="size-3 rounded-full bg-yellow-400" />
                    <div className="size-3 rounded-full bg-green-400" />
                  </div>
                  <div className="mx-auto flex items-center gap-1.5 rounded-md bg-white px-3 py-1 text-xs text-gray-500">
                    <ShieldCheck className="size-3 text-green-600" />
                    invoice-navi.app/dashboard
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="grid gap-0 md:grid-cols-[200px_1fr]">
                  {/* Sidebar */}
                  <div className="hidden border-r border-gray-100 bg-gray-50/50 p-4 md:block">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-indigo-600">
                        <FileText className="size-4 text-white" />
                      </div>
                      <span className="text-sm font-bold">請求書ナビ</span>
                    </div>
                    <nav className="space-y-1 text-sm">
                      <div className="rounded-md bg-blue-50 px-3 py-2 font-medium text-blue-700">
                        ダッシュボード
                      </div>
                      <div className="px-3 py-2 text-gray-600">請求書</div>
                      <div className="px-3 py-2 text-gray-600">取引先</div>
                      <div className="px-3 py-2 text-gray-600">定期請求</div>
                      <div className="px-3 py-2 text-gray-600">設定</div>
                    </nav>
                  </div>

                  {/* Main content */}
                  <div className="p-5 sm:p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="text-base font-bold sm:text-lg">ダッシュボード</h3>
                      <div className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white">
                        <FileText className="size-3" />
                        新規作成
                      </div>
                    </div>

                    <div className="mb-5 grid grid-cols-3 gap-3">
                      <div className="rounded-lg border border-gray-100 bg-white p-3">
                        <p className="text-[10px] font-medium text-gray-500">今月の請求額</p>
                        <p className="mt-1 font-mono text-base font-bold sm:text-lg">¥1,850,000</p>
                      </div>
                      <div className="rounded-lg border border-gray-100 bg-white p-3">
                        <p className="text-[10px] font-medium text-gray-500">未払い</p>
                        <p className="mt-1 font-mono text-base font-bold text-amber-600 sm:text-lg">
                          ¥605,000
                        </p>
                      </div>
                      <div className="rounded-lg border border-gray-100 bg-white p-3">
                        <p className="text-[10px] font-medium text-gray-500">入金済み</p>
                        <p className="mt-1 font-mono text-base font-bold text-green-600 sm:text-lg">
                          ¥1,245,000
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-100">
                      <div className="border-b border-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-500">
                        最近の請求書
                      </div>
                      <div className="divide-y divide-gray-100">
                        {[
                          { id: 'INV-2026-0042', name: '株式会社サンプル', amount: '¥605,000', status: '送信済' },
                          { id: 'INV-2026-0041', name: '合同会社デモ', amount: '¥330,000', status: '入金済' },
                          { id: 'INV-2026-0040', name: '有限会社テスト', amount: '¥275,000', status: '下書き' },
                        ].map((invoice) => (
                          <div
                            key={invoice.id}
                            className="flex items-center justify-between px-4 py-3 text-xs"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-mono text-[11px] text-gray-500">
                                {invoice.id}
                              </p>
                              <p className="truncate font-medium text-gray-900">{invoice.name}</p>
                            </div>
                            <div className="ml-3 text-right">
                              <p className="font-mono font-semibold text-gray-900">
                                {invoice.amount}
                              </p>
                              <p className="text-[10px] text-gray-500">{invoice.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold tracking-wider text-blue-600 uppercase">
                How it works
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                3ステップですぐに使える
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
                複雑な設定は不要。最短30秒で請求書の発行を開始できます。
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.number} className="relative">
                    {/* Connector line */}
                    {index < steps.length - 1 && (
                      <div
                        className="absolute top-8 left-[60%] hidden h-px w-[80%] bg-gradient-to-r from-blue-200 to-transparent md:block"
                        aria-hidden
                      />
                    )}
                    <div className="relative flex flex-col items-center text-center">
                      <div className="relative mb-5">
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/25">
                          <Icon className="size-7 text-white" />
                        </div>
                        <span className="absolute -top-2 -right-2 inline-flex size-7 items-center justify-center rounded-full border-2 border-white bg-white font-mono text-xs font-bold text-blue-600 shadow-md ring-1 ring-blue-100">
                          {step.number}
                        </span>
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">{step.title}</h3>
                      <p className="max-w-xs text-sm leading-relaxed text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-50/50 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-sm font-semibold tracking-wider text-blue-600 uppercase">
                FAQ
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                よくあるご質問
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
                お問い合わせの前にこちらをご確認ください。
              </p>
            </div>

            <div className="mt-12 space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-gray-300 open:border-blue-200 open:shadow-md"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-gray-900 [&::-webkit-details-marker]:hidden">
                    <span className="text-sm sm:text-base">{faq.question}</span>
                    <span
                      className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all group-open:rotate-45 group-open:bg-blue-100 group-open:text-blue-600"
                      aria-hidden
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="size-4"
                      >
                        <path d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1Z" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-5 pt-0 pb-5 text-sm leading-relaxed text-gray-600">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative overflow-hidden py-20 sm:py-24">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700" />
          <div className="absolute inset-0 -z-10 opacity-20">
            <div className="absolute top-0 left-1/4 size-96 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 right-1/4 size-96 rounded-full bg-indigo-300 blur-3xl" />
          </div>

          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              今すぐ請求書業務を
              <br className="sm:hidden" />
              効率化しよう。
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-blue-100 sm:text-lg">
              アカウント作成は30秒で完了。クレジットカード登録も不要です。
            </p>

            <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-blue-700 shadow-xl shadow-blue-900/20 transition-all hover:-translate-y-0.5 hover:shadow-2xl sm:w-auto"
              >
                無料で始める
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/20 sm:w-auto"
              >
                ログイン
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-blue-100">
              <li className="inline-flex items-center gap-1.5">
                <CreditCard className="size-4" />
                クレジットカード不要
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Clock className="size-4" />
                30秒で登録完了
              </li>
              <li className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-4" />
                インボイス制度対応
              </li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-10 md:grid-cols-4 md:gap-8">
            <div className="md:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm">
                  <FileText className="size-5 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight">請求書ナビ</span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-gray-500">
                シンプルで美しい請求書作成SaaS。
                <br />
                中小企業・フリーランスのために。
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-wider text-gray-900 uppercase">製品</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    href="#features"
                    className="text-gray-600 transition-colors hover:text-blue-600"
                  >
                    機能
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-gray-600 transition-colors hover:text-blue-600"
                  >
                    料金
                  </Link>
                </li>
                <li>
                  <Link
                    href="#updates"
                    className="text-gray-600 transition-colors hover:text-blue-600"
                  >
                    更新情報
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-wider text-gray-900 uppercase">
                サポート
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link href="/help" className="text-gray-600 transition-colors hover:text-blue-600">
                    ヘルプ
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="text-gray-600 transition-colors hover:text-blue-600"
                  >
                    お問い合わせ
                  </Link>
                </li>
                <li>
                  <Link
                    href="#faq"
                    className="text-gray-600 transition-colors hover:text-blue-600"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-wider text-gray-900 uppercase">会社</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    href="#company"
                    className="text-gray-600 transition-colors hover:text-blue-600"
                  >
                    運営会社
                  </Link>
                </li>
                <li>
                  <Link
                    href="#terms"
                    className="text-gray-600 transition-colors hover:text-blue-600"
                  >
                    利用規約
                  </Link>
                </li>
                <li>
                  <Link
                    href="#privacy"
                    className="text-gray-600 transition-colors hover:text-blue-600"
                  >
                    プライバシーポリシー
                  </Link>
                </li>
                <li>
                  <Link
                    href="#tokushoho"
                    className="text-gray-600 transition-colors hover:text-blue-600"
                  >
                    特定商取引法
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row">
            <p className="text-xs text-gray-500">
              © 2026 株式会社デジタルツール研究所. All rights reserved.
            </p>
            <p className="text-xs text-gray-400">Made with care in Japan</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
