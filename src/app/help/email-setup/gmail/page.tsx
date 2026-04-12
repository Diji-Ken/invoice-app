import Link from 'next/link';
import { ArrowLeft, Info, AlertTriangle, HelpCircle, Mail } from 'lucide-react';

export default function GmailSetupPage() {
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
        Gmailでメール送信を設定する
      </h1>
      <p className="mt-2 mb-8 text-gray-500">
        Googleアカウントのアプリパスワードを利用して、Gmailから請求書を送信できるように設定します。
      </p>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <h2 className="mt-10 text-2xl font-bold text-gray-900">前提条件</h2>
        <ul className="ml-6 list-disc space-y-2">
          <li>Googleアカウント（個人のGmailまたはGoogle Workspace）を持っていること</li>
          <li>2段階認証プロセスを有効化できること</li>
        </ul>

        <div className="not-prose my-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Info className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">所要時間の目安</p>
              <p className="text-sm text-blue-800">
                2段階認証がすでに有効になっている場合、5分ほどで設定が完了します。初めて2段階認証を有効化する場合は、電話認証を含めて10〜15分ほど見ておくと安心です。
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          Step 1: 2段階認証を有効化する
        </h2>
        <p>
          Googleはセキュリティ上の理由から、通常のパスワードでの外部ログインを許可していません。代わりに「アプリパスワード」という専用のパスワードを発行する必要があり、その前提として2段階認証が有効になっている必要があります。
        </p>
        <ol className="ml-6 list-decimal space-y-2">
          <li>
            Googleアカウント（
            <a
              href="https://myaccount.google.com"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://myaccount.google.com
            </a>
            ）にアクセスします。
          </li>
          <li>左メニューから「セキュリティ」を選択します。</li>
          <li>
            「Googleへのログイン」セクションにある「2段階認証プロセス」をクリックし、「使ってみる」をクリックします。
          </li>
          <li>電話番号を入力し、SMSまたは音声通話で届いたコードを入力して認証します。</li>
          <li>「有効にする」をクリックして2段階認証を確定します。</li>
        </ol>

        <div className="not-prose my-6 overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
          <p className="text-sm text-gray-400">
            スクリーンショット：Googleアカウントセキュリティ画面
          </p>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          Step 2: アプリパスワードを生成する
        </h2>
        <ol className="ml-6 list-decimal space-y-2">
          <li>
            ブラウザで
            <a
              href="https://myaccount.google.com/apppasswords"
              target="_blank"
              rel="noreferrer"
              className="mx-1 text-blue-600 hover:underline"
            >
              https://myaccount.google.com/apppasswords
            </a>
            にアクセスします。
          </li>
          <li>
            「アプリ名」に <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-900">請求書ナビ</code> と入力します。
          </li>
          <li>「作成」ボタンをクリックします。</li>
          <li>
            16桁のパスワードが黄色いボックスに表示されます。スペース込みのものをそのままコピーしてください。
          </li>
        </ol>

        <div className="not-prose my-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 size-5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-900">重要</p>
              <p className="text-sm text-amber-800">
                この画面を閉じるとアプリパスワードは二度と表示されません。必ずコピーしてから次のステップに進んでください。忘れた場合は一度削除して再生成が必要になります。
              </p>
            </div>
          </div>
        </div>

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
            プロバイダの選択で <strong>「Gmail」</strong> を選びます。
          </li>
          <li>「メールアドレス」にご自身のGmailアドレスを入力します。</li>
          <li>
            「アプリパスワード」に Step 2 でコピーした16桁を貼り付けます。スペースは入っていても入っていなくてもどちらでも構いません。
          </li>
          <li>
            「接続テスト」をクリックします。ご自身のメールアドレス宛にテストメールが届けば成功です。
          </li>
          <li>最後に「保存」をクリックして設定を確定します。</li>
        </ol>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">注意事項</h2>

        <div className="not-prose my-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 size-5 flex-shrink-0 text-amber-600" />
            <div className="space-y-2 text-sm text-amber-800">
              <p className="font-semibold text-amber-900">必ず確認してください</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>通常のGmailパスワードではなく、アプリパスワードを使用してください。</li>
                <li>2段階認証が有効でないとアプリパスワードは作成できません。</li>
                <li>無料Gmailの送信上限は 1日あたり500通 までです。</li>
                <li>Google Workspaceでは 1日あたり2000通 まで送信できます。</li>
                <li>短時間に大量送信すると、Google側で一時的に制限がかかる場合があります。</li>
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
              <span className="flex-1">アプリパスワードが作成できない</span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="mt-3 pl-8 text-sm leading-relaxed text-gray-700">
              <p>
                2段階認証プロセスが有効になっていない可能性があります。Step 1 の手順で2段階認証を有効化してから、再度 Step 2 を試してください。Google Workspaceアカウントの場合、組織の管理者がアプリパスワードの利用を制限していることもあります。その場合はIT管理者にご相談ください。
              </p>
            </div>
          </details>

          <details className="group rounded-xl border border-gray-200 bg-white p-5">
            <summary className="flex cursor-pointer items-start gap-3 text-sm font-semibold text-gray-900 marker:hidden [&::-webkit-details-marker]:hidden">
              <HelpCircle className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
              <span className="flex-1">
                接続テストで「Invalid credentials」と表示される
              </span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="mt-3 pl-8 text-sm leading-relaxed text-gray-700">
              <p>
                アプリパスワードの入力ミス、または通常のGoogleパスワードを入力している可能性があります。Step 2 の手順でアプリパスワードを再生成し、正確に貼り付けてからもう一度お試しください。
              </p>
            </div>
          </details>

          <details className="group rounded-xl border border-gray-200 bg-white p-5">
            <summary className="flex cursor-pointer items-start gap-3 text-sm font-semibold text-gray-900 marker:hidden [&::-webkit-details-marker]:hidden">
              <HelpCircle className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
              <span className="flex-1">送信は成功するがメールが届くのが遅い</span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="mt-3 pl-8 text-sm leading-relaxed text-gray-700">
              <p>
                Google側の配信処理によるもので、通常数秒〜数十秒で届きます。1分以上経っても届かない場合は、受信側の迷惑メールフォルダを確認してください。それでも届かない場合は、一時的にGoogle側で配信キューが混んでいる可能性があります。
              </p>
            </div>
          </details>
        </div>

        <div className="not-prose my-10 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Mail className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                設定が完了したら
              </p>
              <p className="text-sm text-blue-800">
                実際に請求書をメール送信してみましょう。テンプレートのカスタマイズ方法は
                <Link
                  href="/help/email"
                  className="mx-1 underline decoration-blue-400 underline-offset-2 hover:text-blue-900"
                >
                  メール送信ガイド
                </Link>
                を参照してください。
              </p>
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
