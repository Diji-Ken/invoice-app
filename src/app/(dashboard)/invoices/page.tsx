'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { InvoiceStatusBadge } from '@/components/invoices/invoice-status-badge';
import { fmtDate, fmtCurrency } from '@/lib/invoice-helpers';
import type { Invoice, InvoiceStatus } from '@/lib/types';

type InvoiceWithCustomer = Omit<Invoice, 'customer'> & {
  customer?: { id: string; company_name: string } | null;
};

const statusTabs: { value: string; label: string }[] = [
  { value: 'all', label: '全て' },
  { value: 'draft', label: '下書き' },
  { value: 'issued', label: '発行済' },
  { value: 'sent', label: '送信済' },
  { value: 'paid', label: '入金済' },
  { value: 'overdue', label: '期限超過' },
];

const PAGE_SIZE = 20;

export default function InvoicesPage() {
  const router = useRouter();

  const [invoices, setInvoices] = useState<InvoiceWithCustomer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(PAGE_SIZE));
      if (status !== 'all') params.set('status', status);
      if (search) params.set('search', search);

      const res = await fetch(`/api/invoices?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.invoices ?? []);
        setTotal(data.total ?? 0);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  function handleStatusChange(value: string) {
    setStatus(value);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">請求書</h1>
        <Button onClick={() => router.push('/invoices/new')}>
          <Plus className="h-4 w-4 mr-2" />
          新規作成
        </Button>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Tabs value={status} onValueChange={handleStatusChange} className="w-full sm:w-auto">
          <TabsList>
            {statusTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-xs sm:text-sm">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="請求番号・件名で検索"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <FileText className="h-12 w-12 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">請求書がありません</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push('/invoices/new')}
          >
            <Plus className="h-4 w-4 mr-2" />
            最初の請求書を作成
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">請求番号</TableHead>
                  <TableHead>取引先</TableHead>
                  <TableHead>件名</TableHead>
                  <TableHead className="text-right w-[130px]">金額</TableHead>
                  <TableHead className="w-[100px]">ステータス</TableHead>
                  <TableHead className="w-[130px]">発行日</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow
                    key={inv.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/invoices/${inv.id}`)}
                  >
                    <TableCell className="font-mono text-sm">
                      {inv.invoice_number}
                    </TableCell>
                    <TableCell>
                      {inv.customer?.company_name ?? '---'}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {inv.subject}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium">
                      ¥{fmtCurrency(inv.total)}
                    </TableCell>
                    <TableCell>
                      <InvoiceStatusBadge status={inv.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {fmtDate(inv.issue_date)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {invoices.map((inv) => (
              <Card
                key={inv.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => router.push(`/invoices/${inv.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <p className="font-mono text-xs text-muted-foreground">
                        {inv.invoice_number}
                      </p>
                      <p className="text-sm font-medium truncate">
                        {inv.customer?.company_name ?? '---'}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {inv.subject}
                      </p>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <p className="text-sm font-bold tabular-nums">
                        ¥{fmtCurrency(inv.total)}
                      </p>
                      <InvoiceStatusBadge status={inv.status} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {fmtDate(inv.issue_date)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                前へ
              </Button>
              <span className="text-sm text-muted-foreground tabular-nums">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                次へ
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
