import Link from 'next/link';
import { ArrowLeft, Info, AlertTriangle, HelpCircle, Mail } from 'lucide-react';

export default function YahooSetupPage() {
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
        Yahoo Japan メールでメール送信を設定する
      </h1>
      <p className="mt-2 mb-8 text-gray-500">
        Yahoo!メール（@yahoo.co.jp / @ymail.ne.jp）のアプリパスワードを利用して、請求書を送信できるように設定します。
      </p>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <h2 className="mt-10 text-2xl font-bold text-gray-900">前提条件</h2>
        <ul className="ml-6 list-disc space-y-2">
          <li>Yahoo! JAPAN ID を持っていること</li>
          <li>Yahoo!メールをWebブラウザから利用できること</li>
        </ul>

        <div className="not-prose my-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Info className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                Yahoo!プレミアム会員でなくても利用できます
              </p>
              <p className="mt-1 text-sm text-blue-800">
                2023年以降、Yahoo!メールはプレミアム会員でなくても外部メールソフトからのIMAP/POP/SMTPアクセスが利用できるようになりました。追加の課金は不要です。
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          Step 1: アプリパスワードを発行する
        </h2>
        <ol className="ml-6 list-decimal space-y-2">
          <li>
            <a
              href="https://mail.yahoo.co.jp"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              Yahoo!メール
            </a>
            にログインします。
          </li>
          <li>右上の歯車アイコンから「設定・利用規約」→「メールの設定」を開きます。</li>
          <li>
            左メニューの「アカウント」→「IMAP/POP/SMTPアクセスとメール転送」を選択します。
          </li>
          <li>
            「Yahoo!メールをOutlook、Thunderbirdなどのメールソフトや他社メールサービスから送受信する」のチェックを有効にします。
          </li>
          <li>
            続いて表示される「アプリパスワードを管理」をクリックし、「新しいアプリパスワードを生成」を選びます。
          </li>
          <li>
            アプリ名に <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-900">請求書ナビ</code> と入力し、生成されたパスワードをコピーします。
          </li>
        </ol>

        <div className="not-prose my-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 size-5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-900">注意</p>
              <p className="text-sm text-amber-800">
                生成されたアプリパスワードはこの画面でしか表示されません。画面を閉じる前に必ずコピーしてください。
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
            プロバイダの選択で <strong>「Yahoo Japan メール」</strong> を選びます。
          </li>
          <li>「メールアドレス」にYahoo!メールアドレスを入力します。</li>
          <li>
            「アプリパスワード」に Step 1 で生成したものを貼り付けます。
          </li>
          <li>
            SMTPサーバー・ポートは自動設定されます（
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-900">
              smtp.mail.yahoo.co.jp
            </code>
            ・ポート <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-900">465</code>・SSL/TLS）。
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
                よくある誤り
              </p>
              <ul className="ml-4 list-disc space-y-1">
                <li>
                  通常のYahoo! JAPAN IDのパスワードではなく、
                  <strong>アプリパスワード</strong>
                  を使用してください。
                </li>
                <li>
                  「IMAP/POP/SMTPアクセス」を有効化していないと、アプリパスワードを発行しても接続できません。
                </li>
                <li>
                  Yahoo!メール側で迷惑メール対策のため、短時間の大量送信は制限されることがあります。
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
              <span className="flex-1">アプリパスワードの発行ボタンが見当たらない</span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="mt-3 pl-8 text-sm leading-relaxed text-gray-700">
              <p>
                先に「IMAP/POP/SMTPアクセスを有効にする」のチェックを入れる必要があります。チェックを入れて保存した後、もう一度「アプリパスワードを管理」を開くと発行メニューが表示されます。
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
                Yahoo! JAPAN IDのパスワードが入力されていないか確認してください。必ずアプリパスワードを使用してください。また、アプリパスワードを誤って削除してしまった場合は、再度発行してから入力し直してください。
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
