import Link from 'next/link';
import { ArrowLeft, Info, AlertTriangle } from 'lucide-react';

export default function CustomersHelpPage() {
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
        取引先の管理
      </h1>
      <p className="mt-2 mb-8 text-gray-500">
        取引先の追加・編集・無効化、担当者情報や支払方法の登録方法をご案内します。
      </p>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          取引先とは、請求書を発行する相手先のことです。事前に登録しておくことで、請求書作成時に一覧から選ぶだけで請求先情報が自動入力され、入力ミスの防止や作業時間の短縮につながります。
        </p>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          取引先の追加方法
        </h2>
        <p>
          左メニューの「取引先」を開き、右上の「新規追加」ボタンをクリックします。フォームに以下の項目を入力してください。
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>会社名（必須）</li>
          <li>敬称（御中 / 様）</li>
          <li>担当者名</li>
          <li>担当者メールアドレス</li>
          <li>郵便番号・住所</li>
          <li>電話番号</li>
          <li>支払方法（振込 / 口座振替 / その他）</li>
          <li>支払サイト（月末締め翌月末払い など）</li>
          <li>メモ（社内用のフリーテキスト）</li>
        </ul>

        <div className="not-prose my-6 overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
          <p className="text-sm text-gray-400">
            スクリーンショット：取引先追加フォーム
          </p>
        </div>

        <div className="not-prose my-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Info className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">ヒント</p>
              <p className="text-sm text-blue-800">
                会社名は請求書の宛名として大きく表示されます。正式名称（株式会社 ◯◯◯◯）で登録しておくと、取引先とのやり取りも円滑です。
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          担当者・メールアドレスの登録
        </h2>
        <p>
          請求書をメールで送信する場合は、担当者のメールアドレスを必ず登録してください。登録されたアドレスは請求書送信時に「宛先（To）」として自動設定されます。
        </p>
        <p>
          複数の担当者がいる場合は、代表者を1名登録し、必要に応じて請求書作成時にCc/Bccを追加する運用をおすすめします。
        </p>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          支払方法の設定
        </h2>
        <p>
          取引先ごとに支払方法を登録することで、請求書に応じた振込先情報や支払条件を自動で反映できます。選択できる支払方法は以下のとおりです。
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>
            <strong>銀行振込</strong>：会社情報に登録された銀行口座情報が請求書に表示されます
          </li>
          <li>
            <strong>口座振替</strong>：支払期日に口座から自動引き落としされる取引先向け
          </li>
          <li>
            <strong>その他</strong>：現金払い、クレジットカードなど独自の支払方法
          </li>
        </ul>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          支払サイトの設定
        </h2>
        <p>
          支払サイトとは「締め日から支払期日までの期間」のことです。取引先ごとに異なる支払サイトを登録しておくと、請求書の発行日から自動的に支払期限が計算されます。
        </p>
        <p>代表的な支払サイト例：</p>
        <ul className="ml-6 list-disc space-y-1">
          <li>月末締め翌月末払い</li>
          <li>月末締め翌月10日払い</li>
          <li>月末締め翌々月末払い</li>
          <li>発行日から30日後</li>
        </ul>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          取引先の編集・無効化
        </h2>
        <p>
          登録済みの取引先は、一覧画面から該当の行をクリックして編集画面を開けます。会社名・担当者・住所などの情報はいつでも更新可能です。
        </p>
        <p>
          取引停止した取引先は「無効化」できます。無効化された取引先は請求書作成時の選択肢に表示されなくなりますが、過去の請求書データはそのまま残ります。必要に応じて再度「有効化」することも可能です。
        </p>

        <div className="not-prose my-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 size-5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                削除ではなく無効化を推奨
              </p>
              <p className="text-sm text-amber-800">
                過去に請求書を発行した取引先は、完全に削除するのではなく「無効化」することをおすすめします。削除すると過去の請求書の取引先情報が失われる可能性があります。
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          取引先の検索・絞り込み
        </h2>
        <p>
          取引先一覧では、会社名・担当者名・メールアドレスでのキーワード検索が可能です。有効/無効でのフィルタリングにも対応しています。取引先が多い場合に便利です。
        </p>
      </div>
    </article>
  );
}
