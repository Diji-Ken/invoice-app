import Link from 'next/link';
import { ArrowLeft, HelpCircle, Mail } from 'lucide-react';

type Faq = {
  q: string;
  a: React.ReactNode;
};

const faqs: Faq[] = [
  {
    q: '無料で使えますか？',
    a: (
      <>
        <p>
          はい、請求書ナビは無料プランをご用意しています。無料プランでも、取引先の登録、請求書の作成・PDF出力、メール送信、ステータス管理など、基本的な機能をすべてご利用いただけます。
        </p>
        <p>
          より大量の請求書発行や高度な機能（カスタムテンプレート、複数ユーザー共有など）が必要な場合は、有料プランへのアップグレードをご検討ください。
        </p>
      </>
    ),
  },
  {
    q: 'サインアップ後にログインできない場合はどうすればよいですか？',
    a: (
      <>
        <p>
          いくつか原因が考えられます。以下を順にご確認ください。
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>
            確認メール内のリンクをクリックしてメール認証が完了しているか
          </li>
          <li>メールアドレス・パスワードに入力ミスがないか</li>
          <li>迷惑メールフォルダに確認メールが振り分けられていないか</li>
          <li>パスワードを忘れていないか（ログイン画面から再設定が可能）</li>
        </ul>
        <p>
          それでも解決しない場合は、サポートまでお問い合わせください。アカウント状況を確認いたします。
        </p>
      </>
    ),
  },
  {
    q: 'インボイス制度に対応していますか？',
    a: (
      <>
        <p>
          はい、請求書ナビはインボイス制度（適格請求書等保存方式）に完全対応しています。適格請求書として必要な項目をすべて含んだ請求書を発行できます。
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>適格請求書発行事業者の登録番号（T＋13桁）の表示</li>
          <li>税率ごとに区分した合計金額</li>
          <li>税率ごとの消費税額の記載</li>
          <li>軽減税率（8%）の明示</li>
        </ul>
        <p>
          詳しくは
          <Link
            href="/help/company-settings"
            className="text-blue-600 hover:underline"
          >
            会社情報の設定
          </Link>
          をご覧ください。
        </p>
      </>
    ),
  },
  {
    q: 'メール送信ができない場合は？',
    a: (
      <>
        <p>以下の点をご確認ください。</p>
        <ul className="ml-6 list-disc space-y-1">
          <li>請求書が「発行済」になっているか（下書きは送信できません）</li>
          <li>取引先の担当者メールアドレスが登録されているか</li>
          <li>会社情報の送信元メールアドレスが設定されているか</li>
          <li>件名・本文が空欄になっていないか</li>
        </ul>
        <p>
          それでも送信できない場合は、一時的なサーバー障害の可能性もあります。しばらく時間をおいて再度お試しいただくか、サポートまでご連絡ください。
        </p>
      </>
    ),
  },
  {
    q: 'PDFのデザインを変更できますか？',
    a: (
      <>
        <p>
          はい、2種類のデザインから選択できます。「スタンダード」はモノクロ基調のクラシックなデザイン、「青緑アクセント」はモダンでスタイリッシュなデザインです。
        </p>
        <p>
          請求書ごとに個別にデザインを切り替えられるため、取引先に応じて使い分けることも可能です。詳しくは
          <Link href="/help/pdf" className="text-blue-600 hover:underline">
            PDFの出力ガイド
          </Link>
          をご覧ください。
        </p>
      </>
    ),
  },
  {
    q: '請求書番号のフォーマットを変更できますか？',
    a: (
      <>
        <p>
          現在、請求書番号のフォーマットは「INV-YYYYMM-NNNN」固定です（例：INV-202604-0001）。月ごとに連番がリセットされる仕様となっています。
        </p>
        <p>
          カスタムフォーマットへの対応は今後のアップデートで順次追加予定です。現時点で特定のフォーマットが必須の場合は、サポートまでご要望をお寄せください。
        </p>
      </>
    ),
  },
  {
    q: '取引先を間違えて登録した場合はどうすればよいですか？',
    a: (
      <>
        <p>
          取引先の編集画面から情報を修正してください。会社名・住所・担当者などはいつでも変更可能です。
        </p>
        <p>
          すでに請求書を発行した後で取引先情報を修正しても、過去の請求書は発行時の情報のまま保持されます。過去の請求書の取引先情報も更新したい場合は、個別に請求書を編集してください。
        </p>
      </>
    ),
  },
  {
    q: 'データの移行はできますか？',
    a: (
      <>
        <p>
          他サービスからのCSVインポート機能を順次追加予定です。現時点では、取引先・請求書ともに手動での登録をお願いしています。
        </p>
        <p>
          データ量が多く移行に困っている場合は、サポートまでご相談ください。CSVファイルを共有いただければ、個別にサポートいたします。
        </p>
      </>
    ),
  },
  {
    q: '解約・データ削除はどうすればよいですか？',
    a: (
      <>
        <p>
          アカウントの解約は設定画面の「アカウント」タブから行えます。解約時には、登録されているすべてのデータ（取引先・請求書・履歴）が削除されます。
        </p>
        <p>
          解約前に大切なデータ（特に過去の請求書PDF）をダウンロードしておくことをおすすめします。削除後のデータ復旧はできませんのでご注意ください。
        </p>
      </>
    ),
  },
  {
    q: 'サポートへの問い合わせ方法は？',
    a: (
      <>
        <p>
          サポートへのお問い合わせはメールで承っています。下記のアドレスまでご連絡ください。通常1〜2営業日以内に返信いたします。
        </p>
        <p className="mt-2">
          <a
            href="mailto:support@example.com"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Mail className="size-4" />
            support@example.com
          </a>
        </p>
        <p>
          ご質問の際は、お使いのメールアドレスと、発生した問題の詳細（画面キャプチャがあればなお助かります）を添えていただけますと、スムーズにサポートできます。
        </p>
      </>
    ),
  },
];

export default function FaqPage() {
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
        よくある質問
      </h1>
      <p className="mt-2 mb-8 text-gray-500">
        請求書ナビの利用にあたって、よくお寄せいただく質問をまとめました。
      </p>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-sm"
          >
            <summary className="flex cursor-pointer items-start gap-3 text-base font-semibold text-gray-900 marker:hidden [&::-webkit-details-marker]:hidden">
              <HelpCircle className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
              <span className="flex-1">{faq.q}</span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-3 pl-8 text-sm leading-relaxed text-gray-700">
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <h2 className="text-lg font-bold text-gray-900">
          質問が見つからない場合
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          こちらに掲載されていない質問がありましたら、お気軽にサポートまでお問い合わせください。
        </p>
        <a
          href="mailto:support@example.com"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Mail className="size-4" />
          サポートに問い合わせる
        </a>
      </div>
    </article>
  );
}
