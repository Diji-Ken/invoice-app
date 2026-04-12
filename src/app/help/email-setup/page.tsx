import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Info,
  Server,
  Cloud,
  Apple,
  CircleUser,
  Settings2,
} from 'lucide-react';

const providers = [
  {
    icon: Mail,
    name: 'Gmail',
    description: '最も一般的なメールサービス。アプリパスワードで簡単に接続できます。',
    href: '/help/email-setup/gmail',
    color: 'bg-red-50 text-red-600',
    badge: '人気',
  },
  {
    icon: Cloud,
    name: 'Outlook / Office365',
    description: '個人のOutlook.comおよびMicrosoft 365組織アカウントに対応しています。',
    href: '/help/email-setup/outlook',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Apple,
    name: 'iCloud Mail',
    description: '@icloud.com / @me.com のアドレスから送信するための設定手順です。',
    href: '/help/email-setup/icloud',
    color: 'bg-gray-100 text-gray-700',
  },
  {
    icon: CircleUser,
    name: 'Yahoo Japan メール',
    description: 'Yahoo! JAPAN ID（@yahoo.co.jp）のメールから送信できます。',
    href: '/help/email-setup/yahoo',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: Server,
    name: 'Xserver',
    description: 'Xserverレンタルサーバーで作成した独自ドメインメールに対応しています。',
    href: '/help/email-setup/xserver',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Settings2,
    name: 'カスタムSMTP',
    description: 'さくら・ロリポップ・ConoHa・AWS SESなど、任意のSMTPサーバーを設定できます。',
    href: '/help/email-setup/custom',
    color: 'bg-amber-50 text-amber-600',
  },
];

export default function EmailSetupIndexPage() {
  return (
    <article className="max-w-4xl">
      <Link
        href="/help"
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="size-4" />
        ヘルプに戻る
      </Link>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
        メール送信設定ガイド
      </h1>
      <p className="mt-2 text-lg text-gray-500">プロバイダ別の設定方法</p>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <p>
          請求書ナビでは、各社が自社のメールアドレスから請求書を送信できます。お使いのメールサービスを選んで、設定手順を確認してください。
        </p>

        <div className="not-prose my-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Info className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                なぜ自社のメールアドレスで送信するのか？
              </p>
              <p className="mt-1 text-sm text-blue-800">
                取引先にとっては、普段やり取りしているメールアドレスから届いた請求書のほうが信頼性が高く、迷惑メールに振り分けられる可能性も低くなります。請求書ナビ経由で送信しても、取引先には通常のメールとして届きます。
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="mb-5 text-xl font-bold text-gray-900">
          プロバイダを選択
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {providers.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.href}
                href={p.href}
                className="group relative rounded-xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
              >
                {p.badge && (
                  <span className="absolute right-4 top-4 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    {p.badge}
                  </span>
                )}
                <div
                  className={`mb-3 inline-flex rounded-lg p-2.5 ${p.color}`}
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="mb-1 text-base font-semibold text-gray-900 group-hover:text-blue-600">
                  {p.name}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {p.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-12 rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <h2 className="text-lg font-bold text-gray-900">
          設定後にやること
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          メール送信設定が完了したら、請求書一覧から「メール送信」ボタンをクリックして実際に送信してみましょう。テンプレートのカスタマイズ方法は
          <Link
            href="/help/email"
            className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
          >
            メール送信ガイド
          </Link>
          をご覧ください。
        </p>
        <div className="mt-4">
          <Link
            href="/settings/email"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Mail className="size-4" />
            設定を開く
          </Link>
        </div>
      </section>
    </article>
  );
}
