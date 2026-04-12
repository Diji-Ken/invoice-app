import Link from 'next/link';
import { ArrowLeft, Info, AlertTriangle, HelpCircle, Mail } from 'lucide-react';

export default function IcloudSetupPage() {
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
        iCloud Mailでメール送信を設定する
      </h1>
      <p className="mt-2 mb-8 text-gray-500">
        Apple IDのアプリ用パスワードを利用して、iCloud Mailから請求書を送信できるように設定します。
      </p>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <h2 className="mt-10 text-2xl font-bold text-gray-900">前提条件</h2>
        <ul className="ml-6 list-disc space-y-2">
          <li>Apple IDで2ファクタ認証が有効になっていること</li>
          <li>
            iCloud Mailを有効化していること（@icloud.com / @me.com / @mac.com アドレス）
          </li>
        </ul>

        <div className="not-prose my-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Info className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                2ファクタ認証は必須です
              </p>
              <p className="mt-1 text-sm text-blue-800">
                Appleは2019年以降、アプリ用パスワードの発行に2ファクタ認証を必須としています。iPhone・iPadをお持ちであれば、すでに有効になっているケースがほとんどです。
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          Step 1: アプリ用パスワードを生成する
        </h2>
        <ol className="ml-6 list-decimal space-y-2">
          <li>
            <a
              href="https://appleid.apple.com"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              appleid.apple.com
            </a>
            にサインインします。
          </li>
          <li>
            左メニューから「サインインとセキュリティ」を選択します。
          </li>
          <li>「アプリ用パスワード」をクリックします。</li>
          <li>
            「+」（アプリ用パスワードを生成）ボタンをクリックします。
          </li>
          <li>
            名前の入力欄に <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-900">請求書ナビ</code> と入力し、「作成」をクリックします。
          </li>
          <li>
            Apple IDのパスワードを求められた場合は入力します。
          </li>
          <li>
            表示された <strong>16桁のアプリ用パスワード</strong>（例: <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-900">abcd-efgh-ijkl-mnop</code>）をコピーします。
          </li>
        </ol>

        <div className="not-prose my-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 size-5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                パスワードは一度しか表示されません
              </p>
              <p className="text-sm text-amber-800">
                この画面を閉じるとアプリ用パスワードは再表示できません。必ずコピーしてから次のステップに進んでください。紛失した場合は、既存のものを削除して再生成する必要があります。
              </p>
            </div>
          </div>
        </div>

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
            プロバイダの選択で <strong>「iCloud Mail」</strong> を選びます。
          </li>
          <li>
            「メールアドレス」にiCloudメールアドレス（@icloud.com / @me.com / @mac.com）を入力します。
          </li>
          <li>
            「アプリ用パスワード」に Step 1 でコピーした16桁を貼り付けます。
          </li>
          <li>
            SMTPサーバー・ポートは自動設定されます（
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-900">
              smtp.mail.me.com
            </code>
            ・ポート <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-900">587</code>）。
          </li>
          <li>「接続テスト」をクリックして、テストメールが届くことを確認します。</li>
          <li>「保存」をクリックして設定を確定します。</li>
        </ol>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">注意事項</h2>

        <div className="not-prose my-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 size-5 flex-shrink-0 text-amber-600" />
            <div className="space-y-2 text-sm text-amber-800">
              <p className="font-semibold text-amber-900">
                ご利用前にご確認ください
              </p>
              <ul className="ml-4 list-disc space-y-1">
                <li>
                  2ファクタ認証が有効でない場合、アプリ用パスワードは作成できません。
                </li>
                <li>
                  アプリ用パスワードは通常のApple IDパスワードとは別物です。
                </li>
                <li>
                  Appleのアプリ用パスワードは、1つのApple IDあたり最大25個までしか生成できません。不要なものは削除してください。
                </li>
                <li>
                  iCloud Mailには送信レート制限があります。短時間に大量の送信を行うと一時的にブロックされる場合があります。
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
              <span className="flex-1">「アプリ用パスワード」メニューが表示されない</span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="mt-3 pl-8 text-sm leading-relaxed text-gray-700">
              <p>
                Apple IDに2ファクタ認証が設定されていません。iPhone / iPadの「設定」→ 自分の名前 →「サインインとセキュリティ」から2ファクタ認証を有効化してから、再度お試しください。
              </p>
            </div>
          </details>

          <details className="group rounded-xl border border-gray-200 bg-white p-5">
            <summary className="flex cursor-pointer items-start gap-3 text-sm font-semibold text-gray-900 marker:hidden [&::-webkit-details-marker]:hidden">
              <HelpCircle className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
              <span className="flex-1">接続テストで認証エラーになる</span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="mt-3 pl-8 text-sm leading-relaxed text-gray-700">
              <p>
                「メールアドレス」にApple IDのログインメール（@gmail.comなど）ではなく、必ずiCloud Mailのアドレス（@icloud.comなど）を入力してください。また、パスワードにはアプリ用パスワードを使用します。通常のApple IDパスワードでは接続できません。
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
