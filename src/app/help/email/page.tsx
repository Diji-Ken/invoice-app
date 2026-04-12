import Link from 'next/link';
import { ArrowLeft, Info, AlertTriangle, Mail } from 'lucide-react';

const placeholders = [
  { token: '{請求先会社名}', desc: '取引先の会社名に置き換わります' },
  { token: '{請求先担当者名}', desc: '取引先の担当者名に置き換わります' },
  { token: '{商品名}', desc: '請求書の件名（またはサービス名）' },
  { token: '{支払期限}', desc: '請求書の支払期限（例：2026年4月30日）' },
  { token: '{取引日}', desc: '請求書の発行日' },
  { token: '{月}', desc: '発行月（例：4月）' },
  { token: '{請求金額}', desc: '税込の合計金額（例：77,000円）' },
  { token: '{請求書ファイル名}', desc: '添付されるPDFのファイル名' },
  { token: '{請求元会社名}', desc: 'あなたの会社名' },
  { token: '{請求元担当者名}', desc: 'あなたの担当者名' },
  { token: '{請求元電話番号}', desc: 'あなたの会社の電話番号' },
  { token: '{請求元メールアドレス}', desc: 'あなたの会社のメールアドレス' },
];

export default function EmailHelpPage() {
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
        メール送信
      </h1>
      <p className="mt-2 mb-8 text-gray-500">
        作成した請求書をメールで取引先に送信する方法、テンプレートのカスタマイズとプレースホルダーの使い方を解説します。
      </p>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          送信前の準備
        </h2>
        <p>
          請求書をメールで送信するには、事前に以下の準備が必要です。
        </p>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            <strong>取引先のメールアドレス</strong>
            ：取引先の編集画面で、担当者のメールアドレスを登録してください。
          </li>
          <li>
            <strong>送信元（会社情報）の設定</strong>
            ：会社情報ページで、送信元として使用する会社名・担当者名・連絡先を入力してください。
          </li>
          <li>
            <strong>請求書の発行</strong>
            ：下書き状態の請求書は送信できません。発行済みの請求書のみがメール送信の対象です。
          </li>
        </ul>

        <div className="not-prose my-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Info className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">ヒント</p>
              <p className="text-sm text-blue-800">
                メール送信時はPDFファイルが自動的に添付されます。取引先は別途ダウンロードの手間なく、メールを受け取るだけで請求書を確認できます。
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          テンプレートのカスタマイズ
        </h2>
        <p>
          送信するメールの件名・本文は、会社情報ページ内の「メールテンプレート」タブから編集できます。一度設定しておけば、以降すべての請求書に同じテンプレートが使われます。
        </p>
        <p>
          テンプレート内では、取引先や請求書の情報を自動挿入するための「プレースホルダー」を使えます。送信時に実際の値へ置き換えられます。
        </p>

        <div className="not-prose my-6 overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
          <p className="text-sm text-gray-400">
            スクリーンショット：メールテンプレート編集画面
          </p>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          プレースホルダー一覧
        </h2>
        <p>利用可能なプレースホルダーは以下のとおりです。</p>

        <div className="not-prose my-6 overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  プレースホルダー
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  説明
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {placeholders.map((p) => (
                <tr key={p.token}>
                  <td className="px-4 py-2 align-top">
                    <code className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-900">
                      {p.token}
                    </code>
                  </td>
                  <td className="px-4 py-2 text-gray-600">{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          テンプレート例
        </h2>
        <p>以下は一般的なビジネス向けのテンプレート例です。</p>
        <pre className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
{`件名: 【{月}分】請求書のご送付（{請求元会社名}）

{請求先会社名}
{請求先担当者名} 様

いつも大変お世話になっております。
{請求元会社名}の{請求元担当者名}です。

{月}分の請求書をお送りいたします。
以下の内容をご確認のうえ、支払期限までにお振込みいただけますと幸いです。

・請求金額：{請求金額}
・支払期限：{支払期限}
・添付ファイル：{請求書ファイル名}

ご不明点・ご質問がございましたら、お気軽に以下までご連絡ください。

─────────────────────
{請求元会社名}
{請求元担当者名}
TEL: {請求元電話番号}
Mail: {請求元メールアドレス}
─────────────────────`}
        </pre>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          送信の流れ
        </h2>
        <ol className="ml-6 list-decimal space-y-2">
          <li>請求書一覧または詳細画面から「メール送信」ボタンをクリック</li>
          <li>宛先（取引先の担当者メール）を確認</li>
          <li>必要に応じてCc/Bccを追加</li>
          <li>件名・本文がテンプレートから自動生成されていることを確認</li>
          <li>テンプレート内容はその場で編集可能</li>
          <li>「送信」ボタンをクリックして送信完了</li>
        </ol>

        <div className="not-prose my-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 size-5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                送信前の最終確認
              </p>
              <p className="text-sm text-amber-800">
                送信は取り消しできません。宛先・金額・支払期限に誤りがないか、必ず送信前に確認してください。心配な場合は、ご自身のメールアドレスをBccに追加しておくと安心です。
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          送信後のステータス確認
        </h2>
        <p>
          送信が完了すると、請求書のステータスが自動的に「送信済」に変わります。送信履歴は請求書の詳細画面から確認でき、いつ・誰宛に送信したかが記録されます。
        </p>
        <p>
          同じ請求書を再送することも可能です。その場合は「再送信」ボタンから、宛先やメッセージを調整したうえで送信してください。
        </p>

        <div className="not-prose my-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Mail className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                定期請求との連携
              </p>
              <p className="text-sm text-blue-800">
                定期請求を設定している場合、毎月自動でメール送信することも可能です。詳しくは
                <Link
                  href="/help/recurring"
                  className="underline decoration-blue-400 underline-offset-2 hover:text-blue-900"
                >
                  定期請求ガイド
                </Link>
                をご覧ください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
