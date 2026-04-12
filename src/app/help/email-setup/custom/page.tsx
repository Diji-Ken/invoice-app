import Link from 'next/link';
import { ArrowLeft, Info, AlertTriangle, Mail } from 'lucide-react';

export default function CustomSmtpSetupPage() {
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
        カスタムSMTPでメール送信を設定する
      </h1>
      <p className="mt-2 mb-8 text-gray-500">
        Gmail・Outlookなど定番プロバイダ以外のメールサービスや、自前のメールサーバーを利用するための設定手順です。
      </p>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <h2 className="mt-10 text-2xl font-bold text-gray-900">対象</h2>
        <p>カスタムSMTPは、以下のようなケースで利用します。</p>
        <ul className="ml-6 list-disc space-y-2">
          <li>自前のメールサーバー（Postfixなど）を運用している</li>
          <li>
            プリセット以外のメールサービスを使用している（さくらのレンタルサーバー、ロリポップ、ConoHa WING、AWS SES、Resend、Postmark、SendGrid、Mailgun など）
          </li>
          <li>
            社内のメールゲートウェイやリレーサーバーを経由して送信したい
          </li>
        </ul>

        <div className="not-prose my-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Info className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                上級者向けの設定です
              </p>
              <p className="mt-1 text-sm text-blue-800">
                カスタムSMTPはSMTPの基本的な知識がある方向けの設定です。Gmail・Outlookなどの主要プロバイダをお使いの場合は、各プロバイダ専用のガイドをご利用いただくほうがスムーズです。
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          事前に用意する情報
        </h2>
        <p>
          設定前に、ご利用のメールサービスから以下の情報を確認してください。
        </p>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            <strong>SMTPサーバーのホスト名</strong>（例: <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-900">smtp.example.com</code>）
          </li>
          <li>
            <strong>ポート番号</strong>
            （一般的な値: <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-900">465</code>＝SSL/TLS、<code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-900">587</code>＝STARTTLS）
          </li>
          <li>
            <strong>暗号化方式</strong>（SSL/TLS または STARTTLS）
          </li>
          <li>
            <strong>認証ユーザー名</strong>（多くはメールアドレスそのまま）
          </li>
          <li>
            <strong>認証パスワード</strong>
          </li>
        </ul>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          請求書ナビでの設定手順
        </h2>
        <ol className="ml-6 list-decimal space-y-2">
          <li>
            <Link
              href="/settings/email"
              className="text-blue-600 hover:underline"
            >
              設定 → メール送信
            </Link>
            を開きます。
          </li>
          <li>
            プロバイダの選択で <strong>「カスタムSMTP」</strong> を選びます。
          </li>
          <li>
            「差出人メールアドレス」に実際の差出人として表示されるアドレスを入力します。
          </li>
          <li>
            SMTPホスト・ポート・暗号化方式・ユーザー名・パスワードをそれぞれ入力します。
          </li>
          <li>
            「接続テスト」をクリックし、テストメールが届くことを確認します。
          </li>
          <li>「保存」をクリックして設定を確定します。</li>
        </ol>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          主要サービスの設定例
        </h2>

        <h3 className="mt-6 text-lg font-semibold text-gray-900">
          例1: さくらのレンタルサーバー
        </h3>
        <div className="not-prose my-4 overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <th className="w-40 bg-gray-50 px-4 py-2 text-left font-semibold text-gray-700">
                  SMTPサーバー
                </th>
                <td className="px-4 py-2 text-gray-800">
                  メールホストの初期ドメイン（例:{' '}
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">
                    example.sakura.ne.jp
                  </code>
                  ）
                </td>
              </tr>
              <tr>
                <th className="bg-gray-50 px-4 py-2 text-left font-semibold text-gray-700">
                  ポート
                </th>
                <td className="px-4 py-2 text-gray-800">465</td>
              </tr>
              <tr>
                <th className="bg-gray-50 px-4 py-2 text-left font-semibold text-gray-700">
                  暗号化
                </th>
                <td className="px-4 py-2 text-gray-800">SSL/TLS</td>
              </tr>
              <tr>
                <th className="bg-gray-50 px-4 py-2 text-left font-semibold text-gray-700">
                  ユーザー名
                </th>
                <td className="px-4 py-2 text-gray-800">
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">
                    ユーザー名@初期ドメイン
                  </code>
                  {' '}または 作成したメールアドレス
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-900">例2: ロリポップ</h3>
        <div className="not-prose my-4 overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <th className="w-40 bg-gray-50 px-4 py-2 text-left font-semibold text-gray-700">
                  SMTPサーバー
                </th>
                <td className="px-4 py-2 text-gray-800">
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">
                    smtp.lolipop.jp
                  </code>
                </td>
              </tr>
              <tr>
                <th className="bg-gray-50 px-4 py-2 text-left font-semibold text-gray-700">
                  ポート
                </th>
                <td className="px-4 py-2 text-gray-800">465</td>
              </tr>
              <tr>
                <th className="bg-gray-50 px-4 py-2 text-left font-semibold text-gray-700">
                  暗号化
                </th>
                <td className="px-4 py-2 text-gray-800">SSL/TLS</td>
              </tr>
              <tr>
                <th className="bg-gray-50 px-4 py-2 text-left font-semibold text-gray-700">
                  ユーザー名
                </th>
                <td className="px-4 py-2 text-gray-800">作成したメールアドレス</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-900">例3: ConoHa WING</h3>
        <div className="not-prose my-4 overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <th className="w-40 bg-gray-50 px-4 py-2 text-left font-semibold text-gray-700">
                  SMTPサーバー
                </th>
                <td className="px-4 py-2 text-gray-800">
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">
                    mail[1-3].conoha.jp
                  </code>
                  （契約サーバーによる）
                </td>
              </tr>
              <tr>
                <th className="bg-gray-50 px-4 py-2 text-left font-semibold text-gray-700">
                  ポート
                </th>
                <td className="px-4 py-2 text-gray-800">465</td>
              </tr>
              <tr>
                <th className="bg-gray-50 px-4 py-2 text-left font-semibold text-gray-700">
                  暗号化
                </th>
                <td className="px-4 py-2 text-gray-800">SSL/TLS</td>
              </tr>
              <tr>
                <th className="bg-gray-50 px-4 py-2 text-left font-semibold text-gray-700">
                  ユーザー名
                </th>
                <td className="px-4 py-2 text-gray-800">作成したメールアドレス</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600">
          ConoHa WINGでは、契約サーバーによって割り当てられるSMTPホストが <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">mail1.conoha.jp</code>〜<code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">mail3.conoha.jp</code> のいずれかになります。コントロールパネルの「メール設定」から実際のホスト名を確認してください。
        </p>

        <h3 className="mt-6 text-lg font-semibold text-gray-900">例4: AWS SES</h3>
        <div className="not-prose my-4 overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <th className="w-40 bg-gray-50 px-4 py-2 text-left font-semibold text-gray-700">
                  SMTPサーバー
                </th>
                <td className="px-4 py-2 text-gray-800">
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">
                    email-smtp.&lt;region&gt;.amazonaws.com
                  </code>
                </td>
              </tr>
              <tr>
                <th className="bg-gray-50 px-4 py-2 text-left font-semibold text-gray-700">
                  ポート
                </th>
                <td className="px-4 py-2 text-gray-800">587（STARTTLS）</td>
              </tr>
              <tr>
                <th className="bg-gray-50 px-4 py-2 text-left font-semibold text-gray-700">
                  ユーザー名 / パスワード
                </th>
                <td className="px-4 py-2 text-gray-800">
                  SESコンソールで発行するSMTP認証情報
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="not-prose my-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 size-5 flex-shrink-0 text-amber-600" />
            <div className="space-y-2 text-sm text-amber-800">
              <p className="font-semibold text-amber-900">注意</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>
                  各メールサービスの仕様は更新されることがあります。必ず
                  <strong>各プロバイダの公式ドキュメント</strong>
                  をご確認ください。
                </li>
                <li>
                  設定後は必ず「接続テスト」で動作確認することを強く推奨します。
                </li>
                <li>
                  差出人メールアドレスとSMTP認証ユーザー名が異なる場合、なりすまし防止のため一部のSMTPサーバーでは送信が拒否されることがあります。
                </li>
                <li>
                  自前のメールサーバーを使用する場合、SPF/DKIM/DMARCを適切に設定しないと受信側で迷惑メール判定されやすくなります。
                </li>
              </ul>
            </div>
          </div>
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
