import Link from 'next/link';
import { ArrowLeft, Info, Lightbulb, CheckCircle2 } from 'lucide-react';

export default function GettingStartedPage() {
  return (
    <article className="max-w-3xl">
      <Link
        href="/help"
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="size-4" />
        ヘルプに戻る
      </Link>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
        はじめに
      </h1>
      <p className="mt-2 mb-8 text-gray-500">
        請求書ナビのアカウント作成から最初の請求書を発行するまでの流れをご案内します。
      </p>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          1. アカウントの作成
        </h2>
        <p>
          まずはトップページの「無料で始める」ボタンから新規登録画面を開きます。メールアドレスとパスワードを入力して送信すると、確認メールが届きます。メール本文内のリンクをクリックするとアカウントが有効化され、ログインできるようになります。
        </p>

        <div className="not-prose my-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Info className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">ヒント</p>
              <p className="text-sm text-blue-800">
                確認メールが届かない場合は、迷惑メールフォルダをご確認ください。数分経っても届かない場合は、再度サインアップを試すか、入力したメールアドレスが正しいかご確認ください。
              </p>
            </div>
          </div>
        </div>

        <div className="not-prose my-6 overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
          <p className="text-sm text-gray-400">スクリーンショット：新規登録画面</p>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          2. 初期設定（会社情報・銀行口座）
        </h2>
        <p>
          ログイン後、最初に行っていただきたいのが「会社情報の設定」です。左サイドメニューの「設定」から会社情報ページを開き、以下の項目を入力してください。
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>会社名（請求書の発行元として表示されます）</li>
          <li>郵便番号・住所</li>
          <li>電話番号・メールアドレス</li>
          <li>インボイス登録番号（適格請求書発行事業者の方）</li>
          <li>振込先の銀行口座情報</li>
        </ul>
        <p>
          これらの情報はすべての請求書に自動的に反映されます。一度入力すれば、以降は個別の請求書ごとに入力する必要はありません。
        </p>

        <div className="not-prose my-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 size-5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                インボイス制度について
              </p>
              <p className="text-sm text-amber-800">
                適格請求書発行事業者に登録されている場合は、T から始まる13桁の登録番号を必ず入力してください。取引先が仕入税額控除を受けるために必要な情報です。
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          3. 取引先の登録
        </h2>
        <p>
          次に、請求書を発行する相手先を登録します。左メニューの「取引先」から「新規追加」ボタンをクリックし、会社名・担当者名・請求先メールアドレス・住所などを入力します。
        </p>
        <p>
          取引先を事前に登録しておくことで、請求書作成時にプルダウンから選択するだけで請求先情報が自動入力されます。
        </p>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          4. 最初の請求書を作成する
        </h2>
        <p>
          準備が整ったら、いよいよ最初の請求書を作成しましょう。左メニュー「請求書」から「新規作成」を選び、以下の手順で進めます。
        </p>
        <ol className="ml-6 list-decimal space-y-2">
          <li>取引先を選択（登録済みの一覧から選べます）</li>
          <li>発行日・支払期限を設定</li>
          <li>品目（商品名・数量・単価）を追加</li>
          <li>消費税率（10% / 8% / 0%）を選択</li>
          <li>下書き保存、または発行</li>
        </ol>
        <p>
          金額は自動で計算されます。税込/税抜、源泉徴収などにも対応していますので、詳しくは
          <Link href="/help/invoices" className="text-blue-600 hover:underline">
            請求書の作成ガイド
          </Link>
          をご覧ください。
        </p>

        <div className="not-prose my-8 rounded-lg border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-0.5 size-5 flex-shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-emerald-900">
                以上で初期設定は完了です
              </p>
              <p className="mt-1 text-sm text-emerald-800">
                あとは請求書を発行して、PDFとしてダウンロードしたり、メールで送信したりできます。定期的に発生する請求は「定期請求」機能で自動化できます。
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">次のステップ</h2>
        <ul className="ml-6 list-disc space-y-1">
          <li>
            <Link
              href="/help/company-settings"
              className="text-blue-600 hover:underline"
            >
              会社情報の詳細な設定方法
            </Link>
          </li>
          <li>
            <Link
              href="/help/invoices"
              className="text-blue-600 hover:underline"
            >
              請求書の作成ガイド
            </Link>
          </li>
          <li>
            <Link
              href="/help/recurring"
              className="text-blue-600 hover:underline"
            >
              定期請求の設定方法
            </Link>
          </li>
        </ul>
      </div>
    </article>
  );
}
