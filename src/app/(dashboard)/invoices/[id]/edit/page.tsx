'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InvoiceLineItems } from '@/components/invoices/invoice-line-items';
import { calculateTotals, fmtCurrency, emptyItem } from '@/lib/invoice-helpers';
import type { Customer, Invoice, InvoiceItem } from '@/lib/types';

export default function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [subject, setSubject] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [paymentDueDate, setPaymentDueDate] = useState('');
  const [taxRate, setTaxRate] = useState(0.1);
  const [items, setItems] = useState<InvoiceItem[]>([emptyItem()]);
  const [memo, setMemo] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notEditable, setNotEditable] = useState(false);

  const { subtotal, tax, total } = calculateTotals(items, taxRate);

  useEffect(() => {
    Promise.all([fetchInvoice(), fetchCustomers()]);
  }, [id]);

  async function fetchInvoice() {
    setLoading(true);
    try {
      const res = await fetch(`/api/invoices/${id}`);
      if (!res.ok) return;
      const data: Invoice = await res.json();

      if (data.status !== 'draft') {
        setNotEditable(true);
        return;
      }

      setCustomerId(data.customer_id);
      setSubject(data.subject);
      setIssueDate(data.issue_date);
      setPaymentDueDate(data.payment_due_date ?? '');
      setTaxRate(data.tax_rate);
      setItems(data.items.length > 0 ? data.items : [emptyItem()]);
      setMemo(data.memo);
      setNotes(data.notes);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

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

  async function handleSave() {
    if (!customerId || !subject) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          subject,
          issue_date: issueDate,
          payment_due_date: paymentDueDate || null,
          items,
          tax_rate: taxRate,
          memo,
          notes,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || '保存に失敗しました');
        return;
      }

      router.push(`/invoices/${id}`);
    } catch {
      alert('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  const filteredCustomers = customerSearch
    ? customers.filter((c) =>
        c.company_name.toLowerCase().includes(customerSearch.toLowerCase())
      )
    : customers;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notEditable) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push(`/invoices/${id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          戻る
        </Button>
        <p className="text-muted-foreground">
          下書き以外の請求書は編集できません
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/invoices/${id}`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">請求書を編集</h1>
      </div>

      {/* Form */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Main form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">基本情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer */}
              <div className="space-y-2">
                <Label htmlFor="customer">取引先</Label>
                <Select value={customerId} onValueChange={(v) => { if (v) setCustomerId(v); }}>
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="取引先を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        placeholder="検索..."
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
                        取引先が見つかりません
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">件名</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="請求書の件名"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issueDate">発行日</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentDueDate">支払期限</Label>
                  <Input
                    id="paymentDueDate"
                    type="date"
                    value={paymentDueDate}
                    onChange={(e) => setPaymentDueDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Tax rate */}
              <div className="space-y-2">
                <Label htmlFor="taxRate">消費税率</Label>
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
            </CardContent>
          </Card>

          {/* Line items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">品目</CardTitle>
            </CardHeader>
            <CardContent>
              <InvoiceLineItems
                items={items}
                onChange={setItems}
                taxRate={taxRate}
              />
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">補足</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="memo">備考</Label>
                <Textarea
                  id="memo"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="請求書に記載する備考"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">特記事項</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="社内用メモなど"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">金額</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">小計</span>
                  <span className="tabular-nums">{fmtCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    消費税（{Math.round(taxRate * 100)}%）
                  </span>
                  <span className="tabular-nums">{fmtCurrency(tax)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold">合計</span>
                  <span className="text-lg font-bold text-blue-700 tabular-nums">
                    ¥{fmtCurrency(total)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="mt-4">
              <Button
                className="w-full"
                disabled={saving || !customerId || !subject}
                onClick={handleSave}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? '保存中...' : '保存'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
