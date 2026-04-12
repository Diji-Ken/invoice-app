import Link from 'next/link';
import { ArrowLeft, Info, AlertTriangle, HelpCircle, Mail } from 'lucide-react';

export default function OutlookSetupPage() {
  return (
    <article className="max-w-3xl">
      <Link
        href="/help/email-setup"
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="size-4" />
        メール送信設定ガイドに戻る
      </Link>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
        Outlook / Office365でメール送信を設定する
      </h1>
      <p className="mt-2 mb-8 text-gray-500">
        Outlook.comの個人アカウント、およびMicrosoft 365（旧Office 365）の組織アカウントからメール送信する手順です。
      </p>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <h2 className="mt-10 text-2xl font-bold text-gray-900">前提条件</h2>
        <ul className="ml-6 list-disc space-y-2">
          <li>OutlookまたはMicrosoft 365のアカウントを持っていること</li>
          <li>
            組織アカウント（〜@会社ドメイン）の場合、管理者がSMTP認証を許可していること
          </li>
        </ul>

        <div className="not-prose my-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Info className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                個人アカウントと組織アカウントの違い
              </p>
              <p className="mt-1 text-sm text-blue-800">
                @outlook.com、@hotmail.com、@live.jp などは個人アカウントです。会社や学校で利用している独自ドメイン（@your-company.com）のメールはMicrosoft 365の組織アカウントで、管理者の設定が必要になる場合があります。
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          Step 1: アプリパスワードが使えるか確認
        </h2>
        <p>
          Outlook / Microsoft 365では、アカウントの種類によってログイン方式が異なります。お使いのアカウントに応じて以下の手順で確認してください。
        </p>

        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          個人のOutlook.comアカウントの場合
        </h3>
        <ol className="ml-6 list-decimal space-y-2">
          <li>
            <a
              href="https://account.microsoft.com"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              Microsoftアカウント
            </a>
            にサインインします。
          </li>
          <li>「セキュリティ」→「高度なセキュリティオプション」に進みます。</li>
          <li>「アプリパスワード」の項目で「新しいアプリパスワードを作成」をクリックします。</li>
          <li>生成されたパスワードをコピーしておきます。</li>
        </ol>

        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          Microsoft 365（組織アカウント）の場合
        </h3>
        <p>
          組織のテナント設定によっては、通常パスワードでのSMTP接続が許可されています。その場合はアプリパスワードを発行せずにそのままご自身のパスワードで接続できます。ただし、管理者がSMTP AUTH（SMTP認証）を無効化している場合は接続できません。詳しくはIT管理者にご確認ください。
        </p>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          Step 2: 請求書ナビで設定する
        </h2>
        <ol className="ml-6 list-decimal space-y-2">
          <li>
            請求書ナビの
            <Link
              href="/settings/email"
              className="mx-1 text-blue-600 hover:underline"
            >
              設定 → メール送信
            </Link>
            を開きます。
          </li>
          <li>
            プロバイダの選択で <strong>「Outlook / Office365」</strong> を選びます。
          </li>
          <li>「メールアドレス」にOutlookアドレスを入力します。</li>
          <li>「パスワード」にアプリパスワード、または通常のパスワードを入力します。</li>
          <li>
            SMTPサーバー・ポートは自動設定されます（
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-900">
              smtp.office365.com
            </code>
            ・ポート <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-900">587</code> ・STARTTLS）。
          </li>
          <li>「接続テスト」をクリックし、テストメールが届くことを確認します。</li>
          <li>「保存」をクリックして設定を確定します。</li>
        </ol>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">注意事項</h2>

        <div className="not-prose my-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 size-5 flex-shrink-0 text-amber-600" />
            <div className="space-y-2 text-sm text-amber-800">
              <p className="font-semibold text-amber-900">重要な留意点</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>
                  組織アカウントの場合、管理者が <strong>SMTP AUTH（SMTP認証）</strong> を有効化する必要があります。無効な場合は接続できません。
                </li>
                <li>
                  MicrosoftはSMTPによる基本認証を段階的に廃止する方針を示しています。将来的には
                  <strong>OAuth 2.0への移行</strong>
                  が必要になる可能性があります。
                </li>
                <li>
                  送信上限は個人アカウントで1日あたり300通、Microsoft 365では1日あたり10,000通までが目安です。
                </li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          トラブルシューティング
        </h2>
        <div className="space-y-3">
          <details className="group rounded-xl border border-gray-200 bg-white p-5">
            <summary className="flex cursor-pointer items-start gap-3 text-sm font-semibold text-gray-900 marker:hidden [&::-webkit-details-marker]:hidden">
              <HelpCircle className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
              <span className="flex-1">
                「SmtpClientAuthentication is disabled」と表示される
              </span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="mt-3 pl-8 text-sm leading-relaxed text-gray-700">
              <p>
                組織のMicrosoft 365テナントでSMTP認証が無効化されています。Microsoft 365管理センターの「Exchange」→「メールボックス」→ 対象ユーザー →「メール アプリ」から、「認証済みSMTP」を有効化するよう管理者に依頼してください。反映まで数分〜1時間ほどかかる場合があります。
              </p>
            </div>
          </details>

          <details className="group rounded-xl border border-gray-200 bg-white p-5">
            <summary className="flex cursor-pointer items-start gap-3 text-sm font-semibold text-gray-900 marker:hidden [&::-webkit-details-marker]:hidden">
              <HelpCircle className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
              <span className="flex-1">個人アカウントでログインできない</span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="mt-3 pl-8 text-sm leading-relaxed text-gray-700">
              <p>
                個人のOutlook.comアカウントで2段階認証を有効化している場合は、通常パスワードではなくアプリパスワードを使用してください。Step 1 の手順でアプリパスワードを発行し、そちらを「パスワード」欄に入力するとログインできます。
              </p>
            </div>
          </details>

          <details className="group rounded-xl border border-gray-200 bg-white p-5">
            <summary className="flex cursor-pointer items-start gap-3 text-sm font-semibold text-gray-900 marker:hidden [&::-webkit-details-marker]:hidden">
              <HelpCircle className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
              <span className="flex-1">接続がタイムアウトする</span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="mt-3 pl-8 text-sm leading-relaxed text-gray-700">
              <p>
                一時的なネットワーク障害、またはMicrosoft側のサービス障害の可能性があります。
                <a
                  href="https://status.office365.com"
                  target="_blank"
                  rel="noreferrer"
                  className="mx-1 text-blue-600 hover:underline"
                >
                  Microsoft 365 サービス状態
                </a>
                を確認し、問題がなければしばらく時間を置いて再試行してください。
              </p>
            </div>
          </details>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/settings/email"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Mail className="size-4" />
            設定を開く
          </Link>
          <Link
            href="/help/email-setup"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="size-4" />
            メール送信設定ガイドに戻る
          </Link>
        </div>
      </div>
    </article>
  );
}
