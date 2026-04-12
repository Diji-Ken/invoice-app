import Link from 'next/link';
import { ArrowLeft, Info, AlertTriangle, HelpCircle, Mail } from 'lucide-react';

export default function XserverSetupPage() {
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
        Xserverでメール送信を設定する
      </h1>
      <p className="mt-2 mb-8 text-gray-500">
        Xserverレンタルサーバーで作成した独自ドメインメール（例: info@your-domain.com）から請求書を送信する手順です。
      </p>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <h2 className="mt-10 text-2xl font-bold text-gray-900">前提条件</h2>
        <ul className="ml-6 list-disc space-y-2">
          <li>Xserverレンタルサーバーを契約中であること</li>
          <li>独自ドメインでメールアドレスを作成済みであること</li>
          <li>作成したメールアカウントのパスワードを把握していること</li>
        </ul>

        <div className="not-prose my-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Info className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                Xserverのメリット
              </p>
              <p className="mt-1 text-sm text-blue-800">
                Xserverは独自ドメイン（@your-company.com）でメールを送信できるため、取引先から見て信頼性が高く、会社のブランディングにも適しています。契約プランに関わらずSMTP送信が可能です。
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          Step 1: Xserverのサーバー番号を確認する
        </h2>
        <p>
          Xserverでは、契約者ごとに割り当てられたサーバー番号がSMTPサーバー名になります。まずはお使いのサーバー番号を確認しましょう。
        </p>
        <ol className="ml-6 list-decimal space-y-2">
          <li>
            <a
              href="https://www.xserver.ne.jp/login_info.php"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              Xserverアカウント
            </a>
            にログインします。
          </li>
          <li>
            契約管理画面から「サーバーパネル」にログインします。
          </li>
          <li>左メニューの「アカウント」→「サーバー情報」を開きます。</li>
          <li>
            「ホスト名」欄に表示されている値を確認します（例:
            <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-900">
              sv12345.xserver.jp
            </code>
            ）。
          </li>
          <li>この値が請求書ナビに入力するSMTPサーバー名になります。</li>
        </ol>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          Step 2: メールアカウントのパスワードを確認
        </h2>
        <ol className="ml-6 list-decimal space-y-2">
          <li>
            サーバーパネル →「メール」→「メールアカウント設定」を開きます。
          </li>
          <li>使用するドメインを選択します。</li>
          <li>
            対象のメールアカウントのパスワードを確認します。忘れた場合は「パスワード変更」から新しいパスワードに更新できます。
          </li>
        </ol>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          Step 3: 請求書ナビで設定する
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
            プロバイダの選択で <strong>「Xserver」</strong> を選びます。
          </li>
          <li>
            「メールアドレス」にXserverで作成したメールアドレスを入力します（例: <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-900">info@your-domain.com</code>）。
          </li>
          <li>「パスワード」にメールアカウントのパスワードを入力します。</li>
          <li>
            「SMTPサーバー」に Step 1 で確認したホスト名を入力します（例: <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-900">sv12345.xserver.jp</code>）。
          </li>
          <li>
            ポートは <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-900">465</code>、暗号化は <strong>SSL/TLS</strong> に自動設定されます。
          </li>
          <li>「接続テスト」をクリックして、テストメールが届くことを確認します。</li>
          <li>「保存」をクリックして設定を確定します。</li>
        </ol>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          ポイントと送信上限
        </h2>
        <div className="not-prose my-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Info className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
            <div className="space-y-1 text-sm text-blue-800">
              <p>
                <strong>Xserverは契約プランに関わらずSMTP送信が可能です。</strong>
              </p>
              <p>
                送信数の上限は、2025年時点の公式情報をもとにした目安です。
              </p>
              <ul className="ml-4 list-disc space-y-1">
                <li>スタンダードプラン: 1時間あたり約1,500通</li>
                <li>プレミアムプラン: 1時間あたり約3,000通</li>
                <li>ビジネスプラン: 1時間あたり約5,000通</li>
              </ul>
              <p className="mt-2">
                最新の制限値は
                <a
                  href="https://www.xserver.ne.jp"
                  target="_blank"
                  rel="noreferrer"
                  className="mx-1 underline underline-offset-2 hover:text-blue-900"
                >
                  Xserver公式サイト
                </a>
                をご確認ください。
              </p>
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
              <span className="flex-1">「認証エラー」と表示される</span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="mt-3 pl-8 text-sm leading-relaxed text-gray-700">
              <p>
                以下の点を確認してください。
              </p>
              <ul className="ml-4 list-disc space-y-1">
                <li>メールアドレスに入力ミスがないか</li>
                <li>メールアカウントのパスワードが正しいか（Xserverアカウントのパスワードとは別物です）</li>
                <li>SMTPサーバーのホスト名（例: sv12345.xserver.jp）が正しいか</li>
              </ul>
              <p className="mt-2">
                パスワードを忘れてしまった場合は、サーバーパネルの「メールアカウント設定」から新しいパスワードに変更してから再度お試しください。
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
                SMTPサーバー名のサーバー番号（sv12345の部分）が実際のサーバー情報と一致しているかを確認してください。また、ポート465が何らかのネットワーク制限でブロックされていないかもあわせて確認してください。
              </p>
            </div>
          </details>

          <details className="group rounded-xl border border-gray-200 bg-white p-5">
            <summary className="flex cursor-pointer items-start gap-3 text-sm font-semibold text-gray-900 marker:hidden [&::-webkit-details-marker]:hidden">
              <HelpCircle className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
              <span className="flex-1">送信はできるが受信側の迷惑メールに振り分けられる</span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="mt-3 pl-8 text-sm leading-relaxed text-gray-700">
              <p>
                独自ドメインのSPF・DKIMレコードが正しく設定されていないと、Gmail等の受信側で迷惑メール判定を受けやすくなります。Xserverのサーバーパネルから「DNSレコード設定」を確認し、SPFとDKIMを有効化してください。
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
