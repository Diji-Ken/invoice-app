import Link from 'next/link';
import { ArrowLeft, Info, AlertTriangle, Building2 } from 'lucide-react';

export default function CompanySettingsPage() {
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
        会社情報の設定
      </h1>
      <p className="mt-2 mb-8 text-gray-500">
        請求書に表示される発行元情報、銀行口座、印影、メールテンプレートの設定方法をご案内します。
      </p>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          会社情報は、発行するすべての請求書に自動的に反映される大切な設定です。左メニュー「設定 → 会社情報」から編集できます。
        </p>

        <div className="not-prose my-6 overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
          <p className="text-sm text-gray-400">
            スクリーンショット：会社情報設定画面
          </p>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          会社名・住所・電話番号
        </h2>
        <p>
          請求書の発行元として表示される基本情報です。以下の項目を入力してください。
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>会社名（法人名もしくは屋号）</li>
          <li>郵便番号（ハイフン有り/無しどちらでも可）</li>
          <li>都道府県・市区町村・番地</li>
          <li>建物名・部屋番号（任意）</li>
          <li>電話番号・FAX番号</li>
          <li>メールアドレス</li>
        </ul>
        <p>
          個人事業主の方は、屋号がある場合は屋号を、ない場合は氏名を会社名欄に入力してください。
        </p>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          インボイス登録番号（T+13桁）
        </h2>
        <p>
          インボイス制度（適格請求書等保存方式）に対応した請求書を発行するには、適格請求書発行事業者の登録番号を設定します。
        </p>
        <p>
          登録番号は「T」から始まる半角13桁の数字です。例：
          <code className="mx-1 rounded bg-gray-100 px-2 py-0.5 font-mono text-sm text-gray-900">
            T1234567890123
          </code>
        </p>
        <p>
          登録番号が設定されている場合、請求書のPDFに自動的に「登録番号」として表示され、取引先は仕入税額控除を受けることができます。
        </p>

        <div className="not-prose my-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 size-5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-900">ご注意</p>
              <p className="text-sm text-amber-800">
                適格請求書発行事業者に登録されていない方は、登録番号を入力しないでください。誤った番号を入力すると、取引先に迷惑がかかる可能性があります。登録状況は国税庁の「適格請求書発行事業者公表サイト」で確認できます。
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          銀行口座情報
        </h2>
        <p>
          請求書に表示される振込先の銀行口座情報を登録します。以下の項目が必要です。
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>銀行名（例：みずほ銀行）</li>
          <li>支店名（例：渋谷支店）</li>
          <li>口座種別（普通 / 当座）</li>
          <li>口座番号</li>
          <li>口座名義（カナ表記推奨）</li>
        </ul>
        <p>
          複数の銀行口座を登録しておき、請求書ごとに切り替えることもできます。
        </p>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          印影画像の追加
        </h2>
        <p>
          会社印（角印）の画像をアップロードすると、PDF請求書の右上に自動的に印影が表示されます。推奨フォーマットは以下のとおりです。
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>ファイル形式：PNG（背景透過推奨）</li>
          <li>サイズ：300×300px 以上</li>
          <li>容量：500KB 以内</li>
        </ul>
        <p>
          背景が透過されたPNG画像を使用すると、請求書上の他の情報と重なっても自然に見えます。
        </p>

        <div className="not-prose my-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Info className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                印影の作り方
              </p>
              <p className="text-sm text-blue-800">
                既存の角印をスキャナで取り込み、画像編集ソフトで背景を透過処理すると綺麗な印影画像が作れます。無料の電子印鑑作成サービスも利用できます。
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          メールテンプレートのカスタマイズ
        </h2>
        <p>
          請求書をメールで送信する際に使用される本文のテンプレートを編集できます。件名・本文にはプレースホルダーを含めることができ、送信時に自動的に実際の値に置き換えられます。
        </p>
        <p>
          たとえば以下のようなテンプレートが利用できます。
        </p>

        <pre className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
{`件名: 【{月}分】請求書のご送付（{請求元会社名}）

{請求先会社名}
{請求先担当者名} 様

いつもお世話になっております。
{請求元会社名}の{請求元担当者名}です。

{月}分の請求書をお送りいたします。
お手数ですが、ご確認のほどよろしくお願いいたします。

・請求金額：{請求金額}
・支払期限：{支払期限}
・ファイル：{請求書ファイル名}

ご不明点がございましたらお気軽にお問い合わせください。`}
        </pre>
        <p>
          プレースホルダーの詳細は
          <Link href="/help/email" className="text-blue-600 hover:underline">
            メール送信ガイド
          </Link>
          をご覧ください。
        </p>

        <div className="not-prose my-8 rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5">
          <div className="flex gap-3">
            <Building2 className="mt-0.5 size-5 flex-shrink-0 text-gray-500" />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                設定は随時変更可能です
              </p>
              <p className="mt-1 text-sm text-gray-600">
                会社情報は後からいつでも変更できます。ただし、既に発行済みの請求書の情報は変更されませんのでご注意ください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
