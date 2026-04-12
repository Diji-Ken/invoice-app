import Link from 'next/link';
import { ArrowLeft, Info, AlertTriangle, Repeat } from 'lucide-react';

export default function RecurringHelpPage() {
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
        定期請求
      </h1>
      <p className="mt-2 mb-8 text-gray-500">
        毎月発生する同じ内容の請求書を自動で作成・送信する定期請求機能の使い方を解説します。
      </p>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          定期請求とは
        </h2>
        <p>
          定期請求とは、毎月決まったタイミングで同じ内容の請求書を自動的に生成する機能です。顧問料・保守料・サブスクリプションサービスなど、継続的に発生する請求を自動化することで、作業時間を大幅に削減できます。
        </p>

        <div className="not-prose my-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Repeat className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                こんな業務に最適
              </p>
              <p className="text-sm text-blue-800">
                月額顧問料、サーバーやツールの保守料、コワーキングスペース利用料、月額コンサルティング費用、SaaS契約料など、同じ金額を毎月請求する業務に適しています。
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">作成方法</h2>
        <p>
          左メニュー「定期請求」から「新規作成」ボタンをクリックします。フォームには通常の請求書と同じ項目に加えて、定期請求特有の設定項目があります。
        </p>
        <ol className="ml-6 list-decimal space-y-2">
          <li>取引先を選択</li>
          <li>件名・品目・金額を入力（請求書テンプレートとして保存されます）</li>
          <li>送付日・開始日・終了日を設定</li>
          <li>自動送信のオンオフを選択</li>
          <li>「保存」ボタンで定期請求を登録</li>
        </ol>

        <div className="not-prose my-6 overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
          <p className="text-sm text-gray-400">
            スクリーンショット：定期請求作成画面
          </p>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          送付日・開始日・終了日の設定
        </h2>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            <strong>送付日</strong>
            ：毎月何日に請求書を生成するかを指定します。たとえば「毎月1日」に設定すると、毎月1日の早朝に自動的にその月の請求書が作成されます。末日指定（月末）にも対応しています。
          </li>
          <li>
            <strong>開始日</strong>
            ：この定期請求を開始する最初の月を指定します。開始日より前には請求書は生成されません。
          </li>
          <li>
            <strong>終了日</strong>
            ：契約終了日などがあれば指定できます。未設定（無期限）にしておくと、停止するまで毎月生成され続けます。
          </li>
        </ul>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          自動送信オプション
        </h2>
        <p>
          定期請求では、請求書の「生成のみ」と「生成＋自動メール送信」の2つの動作を選べます。
        </p>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            <strong>生成のみ</strong>
            ：毎月自動で請求書の下書き（または発行済）が作成されます。送信はあなたが内容を確認してから手動で行います。
          </li>
          <li>
            <strong>生成＋自動送信</strong>
            ：請求書の生成と同時に、取引先にメールが自動送信されます。確認不要で完全自動化したい場合に便利です。
          </li>
        </ul>

        <div className="not-prose my-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 size-5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                自動送信使用時のご注意
              </p>
              <p className="text-sm text-amber-800">
                自動送信をオンにすると、人の目を通らずに請求書がそのまま送信されます。金額の変動がある取引（時給制など）には不向きです。固定料金の請求書のみ自動送信を有効にすることをおすすめします。
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          手動生成（今月分を生成）
        </h2>
        <p>
          定期請求の詳細画面には「今月分を今すぐ生成」ボタンがあります。送付日を待たずに、その場で今月分の請求書を作成できます。次のような場合に便利です。
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>月の途中に新しい定期請求を開始したい</li>
          <li>急ぎで請求書が必要になった</li>
          <li>送付日設定の動作確認をしたい</li>
        </ul>
        <p>
          手動生成した場合も、翌月以降は通常どおり送付日のタイミングで自動生成されます。
        </p>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          停止・再開
        </h2>
        <p>
          定期請求はいつでも停止・再開が可能です。
        </p>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            <strong>停止</strong>
            ：一時的に生成を止めたい場合に使用します。停止中は請求書は自動生成されません。取引先との契約が一時休止となった際などに便利です。
          </li>
          <li>
            <strong>再開</strong>
            ：停止した定期請求を再度有効にします。次の送付日から自動生成が再開されます。
          </li>
          <li>
            <strong>完全削除</strong>
            ：もう使わない定期請求は削除できます。ただし過去に生成された請求書は残ります。
          </li>
        </ul>

        <div className="not-prose my-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex gap-3">
            <Info className="mt-0.5 size-5 flex-shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-emerald-900">ヒント</p>
              <p className="text-sm text-emerald-800">
                金額や品目の変更があった場合は、定期請求の内容を編集するだけで翌月分から反映されます。すでに生成された過去の請求書は影響を受けません。
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
