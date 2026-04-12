import Link from 'next/link';
import { ArrowLeft, Info, AlertTriangle } from 'lucide-react';

const statuses = [
  {
    name: '下書き',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    desc: '作成中でまだ発行していない状態。自由に編集・削除できます。請求書番号は割り当てられません。',
  },
  {
    name: '発行済',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    desc: '請求書番号が採番され、正式な請求書として確定した状態。PDFダウンロード・メール送信が可能になります。',
  },
  {
    name: '送信済',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    desc: '取引先にメール送信が完了した状態。送信日時・宛先が履歴として記録されています。',
  },
  {
    name: '入金済',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    desc: '支払いを確認済みの状態。売上管理上、完了した請求として扱われます。',
  },
  {
    name: 'キャンセル',
    color: 'bg-rose-100 text-rose-700 border-rose-200',
    desc: '取引が中止・無効となった請求書。取引先に送信済みでも、ステータスだけを変更することで管理できます。',
  },
  {
    name: '期限超過',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    desc: '支払期限を過ぎても入金が確認されていない請求書。自動で判定され、一覧画面で強調表示されます。',
  },
];

export default function StatusHelpPage() {
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
        ステータス管理
      </h1>
      <p className="mt-2 mb-8 text-gray-500">
        請求書のライフサイクルを表す6つのステータスと、その遷移方法を解説します。
      </p>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          請求書ナビでは、請求書1件ごとに現在の状態を表す「ステータス」を自動で管理しています。ステータスを活用することで、未入金の請求書、送信忘れ、期限超過などを一目で把握できます。
        </p>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          6つのステータスの意味
        </h2>

        <div className="not-prose my-6 space-y-3">
          {statuses.map((s) => (
            <div
              key={s.name}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold ${s.color}`}
                >
                  {s.name}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          ステータスの遷移
        </h2>
        <p>
          通常の請求書は以下の流れで状態が遷移していきます。
        </p>
        <pre className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
{`下書き → 発行済 → 送信済 → 入金済
              ↓
           期限超過（支払期限を過ぎた場合）
              ↓
          キャンセル（任意）`}
        </pre>
        <p>
          下書きから発行済への遷移は「発行」ボタンで行います。発行済から送信済への遷移はメール送信時に自動的に行われます。入金済への変更は手動で行います。
        </p>

        <div className="not-prose my-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Info className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">ヒント</p>
              <p className="text-sm text-blue-800">
                請求書一覧画面では、ステータスごとに絞り込み表示ができます。「期限超過」で絞り込めば、督促が必要な請求書をまとめて確認できます。
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          入金済みにする方法
        </h2>
        <p>
          入金を確認したら、ステータスを「入金済」に変更します。操作は請求書の詳細画面から行います。
        </p>
        <ol className="ml-6 list-decimal space-y-2">
          <li>請求書一覧から対象の請求書を開く</li>
          <li>画面右上の「ステータス変更」ドロップダウンを開く</li>
          <li>「入金済」を選択</li>
          <li>入金確認日を入力（デフォルトは本日）</li>
          <li>「更新」ボタンで保存</li>
        </ol>
        <p>
          入金済に変更された請求書は、ダッシュボードの「入金済み金額」に集計され、未入金金額から除外されます。
        </p>

        <div className="not-prose my-6 overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
          <p className="text-sm text-gray-400">
            スクリーンショット：ステータス変更画面
          </p>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          期限超過の自動判定
        </h2>
        <p>
          支払期限を過ぎても入金済みに変更されていない請求書は、自動的に「期限超過」ステータスに切り替わります。毎日深夜に判定処理が走り、当日中に期限を迎えた請求書が対象になります。
        </p>
        <p>
          期限超過のステータスが付いた請求書は、一覧画面で赤色のバッジで強調表示されます。ダッシュボードにも「期限超過件数」として表示されるため、督促漏れを防げます。
        </p>

        <div className="not-prose my-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 size-5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                期限超過への対応
              </p>
              <p className="text-sm text-amber-800">
                期限超過となった場合は、取引先へ速やかに督促を行いましょう。入金確認後は「入金済」へステータスを変更することを忘れないでください。取引中止になった場合は「キャンセル」にします。
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          関連情報
        </h2>
        <ul className="ml-6 list-disc space-y-1">
          <li>
            <Link
              href="/help/invoices"
              className="text-blue-600 hover:underline"
            >
              請求書の作成
            </Link>
          </li>
          <li>
            <Link
              href="/help/email"
              className="text-blue-600 hover:underline"
            >
              メール送信
            </Link>
          </li>
          <li>
            <Link
              href="/help/recurring"
              className="text-blue-600 hover:underline"
            >
              定期請求
            </Link>
          </li>
        </ul>
      </div>
    </article>
  );
}
