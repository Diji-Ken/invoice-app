import Link from 'next/link';
import { ArrowLeft, Info, Download, Printer } from 'lucide-react';

export default function PdfHelpPage() {
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
        PDFの出力
      </h1>
      <p className="mt-2 mb-8 text-gray-500">
        作成した請求書をPDFとしてダウンロード・印刷する方法、デザインスタイルの切り替えについて解説します。
      </p>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          PDFプレビュー
        </h2>
        <p>
          請求書の詳細画面を開くと、右側に実際にPDFとして出力される内容のプレビューが表示されます。レイアウトや金額の表示を出力前に確認できるので、ミスを未然に防げます。
        </p>
        <p>
          プレビュー上でスクロールすれば、複数ページにまたがる請求書もすべて確認可能です。
        </p>

        <div className="not-prose my-6 overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
          <p className="text-sm text-gray-400">
            スクリーンショット：PDFプレビュー画面
          </p>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          ダウンロード方法
        </h2>
        <p>
          請求書詳細画面の右上にある「PDFダウンロード」ボタンをクリックすると、その請求書のPDFファイルがダウンロードされます。ファイル名は自動的に以下の形式で付与されます。
        </p>
        <p className="text-center">
          <code className="rounded bg-gray-100 px-3 py-1 font-mono text-sm text-gray-900">
            請求書_取引先名_YYYYMMDD.pdf
          </code>
        </p>
        <p>
          ダウンロードしたPDFは、会計ソフトへの取り込み、顧客への送付、保管用のバックアップなどにご活用ください。
        </p>

        <div className="not-prose my-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Download className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                電子帳簿保存法対応
              </p>
              <p className="text-sm text-blue-800">
                ダウンロードされたPDFは改ざん防止のメタ情報を含んでおり、電子帳簿保存法の要件に準拠した保存が可能です。
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          2つのデザインスタイル
        </h2>
        <p>
          請求書ナビでは、用途や好みに合わせて選べる2種類のデザインを用意しています。請求書ごとに切り替えが可能です。
        </p>

        <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-3 inline-flex rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              スタンダード
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              モノクロを基調とした、あらゆる業種に馴染むクラシックなデザイン。日本の商習慣にも馴染みやすく、最もフォーマルな印象を与えます。
            </p>
          </div>
          <div className="rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-teal-50 p-5">
            <div className="mb-3 inline-flex rounded-lg bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
              青緑アクセント
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              ヘッダーや合計金額エリアに青緑色のアクセントを効かせた、モダンでスタイリッシュなデザイン。IT・クリエイティブ業界におすすめです。
            </p>
          </div>
        </div>

        <p>
          デザインの切り替えは、請求書の編集画面または詳細画面にある「デザイン」ドロップダウンから行えます。切り替えはその場で即座にプレビューに反映されます。
        </p>

        <div className="not-prose my-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Info className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">ヒント</p>
              <p className="text-sm text-blue-800">
                デザインは請求書ごとに保存されるため、取引先に応じて使い分けることができます。一度選択したデザインは、その請求書に固定されます。
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">印刷方法</h2>
        <p>
          PDFを印刷する場合は、以下の手順をおすすめします。
        </p>
        <ol className="ml-6 list-decimal space-y-2">
          <li>「PDFダウンロード」ボタンでPDFを取得</li>
          <li>PDFビューア（Adobe Acrobat Reader、プレビュー など）で開く</li>
          <li>印刷メニューから用紙サイズをA4に設定</li>
          <li>余白は「標準」または「最小」で出力</li>
        </ol>
        <p>
          請求書のレイアウトはA4縦向きに最適化されています。ブラウザから直接印刷することも可能ですが、PDFからの印刷のほうがレイアウトが崩れにくいためおすすめです。
        </p>

        <div className="not-prose my-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex gap-3">
            <Printer className="mt-0.5 size-5 flex-shrink-0 text-gray-600" />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                ペーパーレス運用
              </p>
              <p className="text-sm text-gray-700">
                近年は電子帳簿保存法の改正により、請求書の電子保存が標準になりつつあります。印刷せず、PDFをそのままメール送信するのが効率的でおすすめです。
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
