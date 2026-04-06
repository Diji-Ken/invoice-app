'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  Edit,
  Send,
  Mail,
  CheckCircle,
  Copy,
  Trash2,
  FileText,
  Loader2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { InvoiceStatusBadge } from '@/components/invoices/invoice-status-badge';
import { fmtDate, fmtCurrency } from '@/lib/invoice-helpers';
import { toast } from 'sonner';
import type { Invoice, InvoiceStatus } from '@/lib/types';

type InvoiceWithCustomer = Omit<Invoice, 'customer'> & {
  customer?: {
    id: string;
    company_name: string;
    email?: string | null;
  };
};

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [invoice, setInvoice] = useState<InvoiceWithCustomer | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  async function fetchInvoice() {
    setLoading(true);
    try {
      const res = await fetch(`/api/invoices/${id}`);
      if (res.ok) {
        setInvoice(await res.json());
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(newStatus: InvoiceStatus) {
    if (!invoice) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/invoices/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setInvoice(updated);
      } else {
        const err = await res.json();
        alert(err.error || '更新に失敗しました');
      }
    } catch {
      alert('更新に失敗しました');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!invoice || invoice.status !== 'draft') return;
    if (!confirm('この請求書を削除しますか？')) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/invoices');
      } else {
        const err = await res.json();
        alert(err.error || '削除に失敗しました');
      }
    } catch {
      alert('削除に失敗しました');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCopy() {
    if (!invoice) return;
    // Navigate to new page with pre-filled data via query params
    // For simplicity, store in sessionStorage and redirect
    sessionStorage.setItem(
      'invoice_copy',
      JSON.stringify({
        customer_id: invoice.customer_id,
        subject: invoice.subject,
        items: invoice.items,
        tax_rate: invoice.tax_rate,
        memo: invoice.memo,
        notes: invoice.notes,
      })
    );
    router.push('/invoices/new');
  }

  async function handleSendEmail() {
    if (!invoice) return;
    setSendLoading(true);
    try {
      const res = await fetch(`/api/invoices/${id}/send`, { method: 'POST' });
      if (res.ok) {
        toast.success('メールを送信しました');
        await fetchInvoice();
      } else {
        const err = await res.json();
        toast.error(err.error || 'メール送信に失敗しました');
      }
    } catch {
      toast.error('メール送信に失敗しました');
    } finally {
      setSendLoading(false);
    }
  }

  function handleDownload() {
    window.open(`/api/invoices/${id}/pdf`, '_blank');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push('/invoices')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          請求書一覧
        </Button>
        <p className="text-muted-foreground">請求書が見つかりません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Button variant="ghost" onClick={() => router.push('/invoices')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          請求書一覧
        </Button>

        <div className="flex items-center gap-2 flex-1">
          <span className="text-lg font-bold">{invoice.invoice_number}</span>
          <InvoiceStatusBadge status={invoice.status} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status-based actions */}
          {invoice.status === 'draft' && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push(`/invoices/${id}/edit`)}
                disabled={actionLoading}
              >
                <Edit className="h-4 w-4 mr-1" />
                編集
              </Button>
              <Button
                size="sm"
                onClick={() => changeStatus('issued')}
                disabled={actionLoading}
              >
                <FileText className="h-4 w-4 mr-1" />
                発行する
              </Button>
            </>
          )}

          {invoice.status === 'issued' && (
            <>
              <Button
                size="sm"
                onClick={() => changeStatus('sent')}
                disabled={actionLoading}
              >
                <Send className="h-4 w-4 mr-1" />
                送信する
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleSendEmail}
                disabled={sendLoading}
              >
                {sendLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Mail className="h-4 w-4 mr-1" />}
                メール送信
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </>
          )}

          {invoice.status === 'sent' && (
            <>
              <Button
                size="sm"
                onClick={() => changeStatus('paid')}
                disabled={actionLoading}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                入金済みにする
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleSendEmail}
                disabled={sendLoading}
              >
                {sendLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Mail className="h-4 w-4 mr-1" />}
                メール送信
              </Button>
            </>
          )}

          {/* Common actions */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-1" />
            ダウンロード
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4 mr-1" />
            コピー
          </Button>
          {invoice.status === 'draft' && (
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={actionLoading}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              削除
            </Button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left sidebar */}
        <div className="lg:w-72 shrink-0">
          <Card>
            <CardContent className="p-4 space-y-3">
              {/* Subject */}
              <div>
                <p className="text-xs text-muted-foreground">件名</p>
                <p className="text-sm font-medium">{invoice.subject}</p>
              </div>

              {/* Customer */}
              <div>
                <p className="text-xs text-muted-foreground">取引先</p>
                <p className="text-sm font-medium">
                  {invoice.customer?.company_name ?? '---'}
                </p>
              </div>

              {/* Issue date */}
              <div>
                <p className="text-xs text-muted-foreground">発行日</p>
                <p className="text-sm">{fmtDate(invoice.issue_date)}</p>
              </div>

              {/* Due date */}
              <div>
                <p className="text-xs text-muted-foreground">支払期限</p>
                <p className="text-sm">
                  {invoice.payment_due_date
                    ? fmtDate(invoice.payment_due_date)
                    : '---'}
                </p>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">ステータス</p>
                <InvoiceStatusBadge status={invoice.status} />
              </div>

              <Separator />

              {/* Amounts */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">小計</span>
                  <span className="tabular-nums">
                    ¥{fmtCurrency(invoice.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">消費税</span>
                  <span className="tabular-nums">
                    ¥{fmtCurrency(invoice.tax)}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t">
                  <span className="font-bold">合計</span>
                  <span className="text-lg font-bold text-blue-700 tabular-nums">
                    ¥{fmtCurrency(invoice.total)}
                  </span>
                </div>
              </div>

              {invoice.memo && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground">備考</p>
                    <p className="text-sm whitespace-pre-wrap">{invoice.memo}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: PDF preview */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            {pdfLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg z-10">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
            <iframe
              src={`/api/invoices/${id}/pdf`}
              className="w-full rounded-lg shadow border"
              style={{ minHeight: '80vh' }}
              onLoad={() => setPdfLoading(false)}
              title="請求書PDF"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
