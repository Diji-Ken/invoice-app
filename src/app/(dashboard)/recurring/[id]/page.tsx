'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Zap, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InvoiceLineItems } from '@/components/invoices/invoice-line-items';
import { calculateTotals, fmtCurrency, fmtDate, emptyItem } from '@/lib/invoice-helpers';
import { useOrg } from '@/lib/org-context';
import { toast } from 'sonner';
import type { Customer, InvoiceItem, Invoice } from '@/lib/types';

export default function RecurringDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { org } = useOrg();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [subject, setSubject] = useState('');
  const [sendDay, setSendDay] = useState('1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [taxRate, setTaxRate] = useState(0.1);
  const [paymentDueDay, setPaymentDueDay] = useState('99');
  const [items, setItems] = useState<InvoiceItem[]>([emptyItem()]);
  const [memo, setMemo] = useState('');
  const [autoSend, setAutoSend] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [lastGeneratedMonth, setLastGeneratedMonth] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [generatedInvoices, setGeneratedInvoices] = useState<Invoice[]>([]);

  const { subtotal, tax, total } = calculateTotals(items, taxRate);

  useEffect(() => {
    fetchCustomers();
    fetchRecurring();
    fetchGeneratedInvoices();
  }, [id]);

  async function fetchCustomers() {
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(Array.isArray(data) ? data : data.customers ?? []);
      }
    } catch {
      // ignore
    }
  }

  async function fetchRecurring() {
    setLoading(true);
    try {
      const res = await fetch(`/api/recurring/${id}`);
      if (!res.ok) {
        toast.error('\u5B9A\u671F\u8ACB\u6C42\u306E\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557\u3057\u307E\u3057\u305F');
        router.push('/recurring');
        return;
      }
      const data = await res.json();
      setCustomerId(data.customer_id);
      setSubject(data.subject);
      setSendDay(String(data.send_day));
      setStartDate(data.start_date);
      setEndDate(data.end_date || '');
      setTaxRate(data.tax_rate);
      setPaymentDueDay(String(data.payment_due_day));
      setItems(data.items?.length ? data.items : [emptyItem()]);
      setMemo(data.memo || '');
      setAutoSend(data.auto_send);
      setIsActive(data.is_active);
      setLastGeneratedMonth(data.last_generated_month);
    } catch {
      toast.error('\u5B9A\u671F\u8ACB\u6C42\u306E\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557\u3057\u307E\u3057\u305F');
    } finally {
      setLoading(false);
    }
  }

  async function fetchGeneratedInvoices() {
    try {
      const res = await fetch(`/api/invoices?recurringId=${id}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setGeneratedInvoices(data.invoices ?? []);
      }
    } catch {
      // ignore
    }
  }

  async function handleSave() {
    if (!customerId || !subject) {
      toast.error('\u53D6\u5F15\u5148\u3068\u4EF6\u540D\u306F\u5FC5\u9808\u3067\u3059');
      return;
    }
    setSaving(true);

    try {
      const res = await fetch(`/api/recurring/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          subject,
          send_day: Number(sendDay),
          start_date: startDate,
          end_date: endDate || null,
          items,
          tax_rate: taxRate,
          payment_due_day: Number(paymentDueDay),
          memo,
          auto_send: autoSend,
          is_active: isActive,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || '\u4FDD\u5B58\u306B\u5931\u6557\u3057\u307E\u3057\u305F');
        return;
      }

      toast.success('\u4FDD\u5B58\u3057\u307E\u3057\u305F');
    } catch {
      toast.error('\u4FDD\u5B58\u306B\u5931\u6557\u3057\u307E\u3057\u305F');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/recurring/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || '\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F');
        return;
      }

      toast.success('\u5B9A\u671F\u8ACB\u6C42\u3092\u524A\u9664\u3057\u307E\u3057\u305F');
      router.push('/recurring');
    } catch {
      toast.error('\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F');
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch(`/api/recurring/${id}/generate`, {
        method: 'POST',
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || '\u751F\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F');
        return;
      }

      const invoice = await res.json();
      toast.success('\u8ACB\u6C42\u66F8\u3092\u751F\u6210\u3057\u307E\u3057\u305F', {
        action: {
          label: '\u78BA\u8A8D\u3059\u308B',
          onClick: () => router.push(`/invoices/${invoice.id}`),
        },
      });

      // Refresh data
      fetchRecurring();
      fetchGeneratedInvoices();
    } catch {
      toast.error('\u751F\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F');
    } finally {
      setGenerating(false);
    }
  }

  const filteredCustomers = customerSearch
    ? customers.filter((c) =>
        c.company_name.toLowerCase().includes(customerSearch.toLowerCase())
      )
    : customers;

  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/recurring')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{'\u5B9A\u671F\u8ACB\u6C42'}</h1>
        </div>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {'\u8AAD\u307F\u8FBC\u307F\u4E2D...'}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/recurring')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{'\u5B9A\u671F\u8ACB\u6C42\u3092\u7DE8\u96C6'}</h1>
          {isActive ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {'\u30A2\u30AF\u30C6\u30A3\u30D6'}
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
              {'\u505C\u6B62'}
            </Badge>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Main form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{'\u57FA\u672C\u60C5\u5831'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer */}
              <div className="space-y-2">
                <Label htmlFor="customer">{'\u53D6\u5F15\u5148'}</Label>
                <Select value={customerId} onValueChange={(v) => { if (v) setCustomerId(v); }}>
                  <SelectTrigger id="customer">
                    <SelectValue placeholder={'\u53D6\u5F15\u5148\u3092\u9078\u629E'} />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        placeholder={'\u691C\u7D22...'}
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="h-8"
                      />
                    </div>
                    {filteredCustomers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.company_name}
                      </SelectItem>
                    ))}
                    {filteredCustomers.length === 0 && (
                      <div className="py-4 text-center text-sm text-muted-foreground">
                        {'\u53D6\u5F15\u5148\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093'}
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">{'\u4EF6\u540D'}</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={'\u5B9A\u671F\u8ACB\u6C42\u306E\u4EF6\u540D'}
                />
              </div>

              {/* Send day */}
              <div className="space-y-2">
                <Label htmlFor="sendDay">{'\u9001\u4ED8\u65E5'}</Label>
                <Select value={sendDay} onValueChange={(v) => { if (v) setSendDay(v); }}>
                  <SelectTrigger id="sendDay" className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dayOptions.map((d) => (
                      <SelectItem key={d} value={String(d)}>
                        {'\u6BCE\u6708'}{d}{'\u65E5'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">{'\u958B\u59CB\u65E5'}</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">{'\u7D42\u4E86\u65E5\uFF08\u4EFB\u610F\uFF09'}</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Tax rate */}
              <div className="space-y-2">
                <Label htmlFor="taxRate">{'\u6D88\u8CBB\u7A0E\u7387'}</Label>
                <Select
                  value={String(taxRate)}
                  onValueChange={(v) => { if (v) setTaxRate(Number(v)); }}
                >
                  <SelectTrigger id="taxRate" className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.1">10%</SelectItem>
                    <SelectItem value="0.08">8%</SelectItem>
                    <SelectItem value="0">0%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment due */}
              <div className="space-y-2">
                <Label htmlFor="paymentDueDay">{'\u652F\u6255\u671F\u9650'}</Label>
                <Select
                  value={paymentDueDay}
                  onValueChange={(v) => { if (v) setPaymentDueDay(v); }}
                >
                  <SelectTrigger id="paymentDueDay" className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="99">{'\u7FCC\u6708\u672B'}</SelectItem>
                    <SelectItem value="25">{'\u7FCC\u670825\u65E5'}</SelectItem>
                    <SelectItem value="0">{'\u5F53\u6708\u672B'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  {'\u30A2\u30AF\u30C6\u30A3\u30D6\uFF08\u81EA\u52D5\u751F\u6210\u6709\u52B9\uFF09'}
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Line items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{'\u54C1\u76EE'}</CardTitle>
            </CardHeader>
            <CardContent>
              <InvoiceLineItems
                items={items}
                onChange={setItems}
                taxRate={taxRate}
              />
            </CardContent>
          </Card>

          {/* Notes & Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{'\u305D\u306E\u4ED6'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="memo">{'\u5099\u8003'}</Label>
                <Textarea
                  id="memo"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder={'\u8ACB\u6C42\u66F8\u306B\u8A18\u8F09\u3059\u308B\u5099\u8003'}
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="autoSend"
                  checked={autoSend}
                  onChange={(e) => setAutoSend(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="autoSend" className="cursor-pointer">
                  {'\u81EA\u52D5\u3067\u30E1\u30FC\u30EB\u9001\u4FE1\u3059\u308B'}
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Generated invoices history */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{'\u751F\u6210\u5C65\u6B74'}</CardTitle>
            </CardHeader>
            <CardContent>
              {lastGeneratedMonth && (
                <p className="text-sm text-muted-foreground mb-4">
                  {'\u6700\u7D42\u751F\u6210: '}{lastGeneratedMonth}
                </p>
              )}
              {generatedInvoices.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {'\u307E\u3060\u8ACB\u6C42\u66F8\u304C\u751F\u6210\u3055\u308C\u3066\u3044\u307E\u305B\u3093'}
                </p>
              ) : (
                <div className="space-y-2">
                  {generatedInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between py-2 px-3 rounded-md border hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/invoices/${inv.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono">{inv.invoice_number}</span>
                        <span className="text-sm text-muted-foreground">
                          {fmtDate(inv.issue_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm tabular-nums">
                          ¥{fmtCurrency(inv.total)}
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Summary & Actions */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{'\u91D1\u984D'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{'\u5C0F\u8A08'}</span>
                  <span className="tabular-nums">{fmtCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {'\u6D88\u8CBB\u7A0E\uFF08'}{Math.round(taxRate * 100)}{'%\uFF09'}
                  </span>
                  <span className="tabular-nums">{fmtCurrency(tax)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold">{'\u5408\u8A08'}</span>
                  <span className="text-lg font-bold text-blue-700 tabular-nums">
                    ¥{fmtCurrency(total)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Button
                className="w-full"
                disabled={saving || !customerId || !subject}
                onClick={handleSave}
              >
                <Save className="h-4 w-4 mr-2" />
                {'\u4FDD\u5B58'}
              </Button>

              <Separator />

              <Button
                variant="outline"
                className="w-full"
                disabled={generating}
                onClick={handleGenerate}
              >
                <Zap className="h-4 w-4 mr-2" />
                {'\u4ECA\u6708\u5206\u3092\u751F\u6210'}
              </Button>

              <Separator />

              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {'\u524A\u9664'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{'\u5B9A\u671F\u8ACB\u6C42\u3092\u524A\u9664'}</DialogTitle>
            <DialogDescription>
              {'\u3053\u306E\u5B9A\u671F\u8ACB\u6C42\u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F\u3053\u306E\u64CD\u4F5C\u306F\u5143\u306B\u623B\u305B\u307E\u305B\u3093\u3002\u751F\u6210\u6E08\u307F\u306E\u8ACB\u6C42\u66F8\u306F\u524A\u9664\u3055\u308C\u307E\u305B\u3093\u3002'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              {'\u30AD\u30E3\u30F3\u30BB\u30EB'}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? '\u524A\u9664\u4E2D...' : '\u524A\u9664\u3059\u308B'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
