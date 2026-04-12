import Link from 'next/link';
import { ArrowLeft, Info, Lightbulb, AlertTriangle } from 'lucide-react';

export default function InvoicesHelpPage() {
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
        請求書の作成
      </h1>
      <p className="mt-2 mb-8 text-gray-500">
        請求書の新規作成から品目追加、消費税計算、発行までの一連の流れを解説します。
      </p>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          新規作成の流れ
        </h2>
        <p>
          左メニューの「請求書」を開き、右上の「新規作成」ボタンをクリックします。作成画面では以下の流れで入力していきます。
        </p>
        <ol className="ml-6 list-decimal space-y-2">
          <li>取引先を選択（事前に登録しておいた一覧から）</li>
          <li>発行日・支払期限を設定</li>
          <li>件名（例：2026年4月分 コンサルティング料）を入力</li>
          <li>品目（商品名・数量・単価・税率）を追加</li>
          <li>メモ・備考を必要に応じて入力</li>
          <li>「下書き保存」または「発行」ボタンで確定</li>
        </ol>

        <div className="not-prose my-6 overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
          <p className="text-sm text-gray-400">
            スクリーンショット：請求書新規作成画面
          </p>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          品目の追加・削除
        </h2>
        <p>
          請求書の本体となる品目は、自由に追加・削除できます。1件の請求書に複数の品目を登録でき、それぞれ個別に数量や単価を設定できます。
        </p>
        <p>品目ごとに設定できる項目は以下のとおりです。</p>
        <ul className="ml-6 list-disc space-y-1">
          <li>品目名（商品名・サービス名）</li>
          <li>数量</li>
          <li>単位（個 / 式 / 時間 など）</li>
          <li>単価</li>
          <li>税率（10% / 8% / 0%）</li>
          <li>備考（その品目に対する追記）</li>
        </ul>
        <p>
          品目行の右端にある「削除」ボタンで不要な品目を削除できます。「＋品目を追加」ボタンで行を追加できます。
        </p>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          消費税の設定（10% / 8% / 0%）
        </h2>
        <p>
          品目ごとに適切な消費税率を選択してください。選択可能な税率は以下のとおりです。
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>
            <strong>10%</strong>：標準税率。一般的な商品・サービスに適用
          </li>
          <li>
            <strong>8%</strong>：軽減税率。飲食料品（酒類・外食を除く）、定期購読の新聞などに適用
          </li>
          <li>
            <strong>0%</strong>：非課税・免税。該当する取引がある場合のみ
          </li>
        </ul>

        <div className="not-prose my-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Info className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                インボイス制度対応
              </p>
              <p className="text-sm text-blue-800">
                税率ごとの合計金額と消費税額は、PDFに自動で区分表示されます。適格請求書（インボイス）として必要な要件を満たしています。
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          自動計算の仕組み
        </h2>
        <p>
          品目の金額は「数量 × 単価」で自動計算されます。すべての品目の合計に対して、税率ごとに消費税額が算出され、最終的な請求金額（税込）が表示されます。
        </p>
        <p>計算例：</p>
        <pre className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
{`品目A: 5個 × 10,000円 = 50,000円（税率10%）
品目B: 1式 × 20,000円 = 20,000円（税率10%）

小計（10%対象）: 70,000円
消費税（10%）:     7,000円
合計:             77,000円`}
        </pre>
        <p>
          複数の税率が混在する場合も自動で区分し、税率ごとに小計を表示します。
        </p>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          下書き保存と発行の違い
        </h2>
        <p>
          請求書は「下書き保存」と「発行」の2段階で管理されます。
        </p>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            <strong>下書き保存</strong>
            ：作成途中の請求書を保存します。取引先には影響しません。いつでも編集・削除が可能です。
          </li>
          <li>
            <strong>発行</strong>
            ：請求書番号が採番され、正式な請求書として確定します。発行後はPDFダウンロード・メール送信ができます。
          </li>
        </ul>

        <div className="not-prose my-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 size-5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-900">ご注意</p>
              <p className="text-sm text-amber-800">
                発行済みの請求書も編集は可能ですが、一度送信した内容と異なるものに書き換えると、取引先とのトラブルの原因になります。金額の修正が必要な場合は、必ず取引先に一報を入れてから修正してください。
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          請求書番号の自動採番について
        </h2>
        <p>
          発行時に請求書番号が自動採番されます。デフォルトでは以下のような形式です。
        </p>
        <p className="text-center">
          <code className="rounded bg-gray-100 px-3 py-1 font-mono text-sm text-gray-900">
            INV-202604-0001
          </code>
        </p>
        <p>
          「INV-」の後に年月、続いて連番が入る形式です。毎月の連番は1からリセットされ、請求書管理がしやすくなっています。
        </p>
        <p>
          下書き状態の請求書には請求書番号は付きません。発行したタイミングで初めて番号が確定します。
        </p>

        <div className="not-prose my-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 size-5 flex-shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-emerald-900">
                作成後のアクション
              </p>
              <p className="text-sm text-emerald-800">
                発行した請求書は、PDFダウンロード、メール送信、ステータス変更（入金済みなど）が可能です。詳しくは
                <Link
                  href="/help/pdf"
                  className="underline decoration-emerald-400 underline-offset-2 hover:text-emerald-900"
                >
                  PDFの出力
                </Link>
                や
                <Link
                  href="/help/email"
                  className="underline decoration-emerald-400 underline-offset-2 hover:text-emerald-900"
                >
                  メール送信
                </Link>
                のガイドをご覧ください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
