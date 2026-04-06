'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
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
import { useOrg } from '@/lib/org-context';
import { toast } from 'sonner';
import type { Customer, InvoiceItem } from '@/lib/types';

export default function NewRecurringPage() {
  const router = useRouter();
  const { org } = useOrg();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [subject, setSubject] = useState('');
  const [sendDay, setSendDay] = useState('1');
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState('');
  const [taxRate, setTaxRate] = useState(0.1);
  const [paymentDueDay, setPaymentDueDay] = useState('99');
  const [items, setItems] = useState<InvoiceItem[]>([emptyItem()]);
  const [memo, setMemo] = useState('');
  const [autoSend, setAutoSend] = useState(false);
  const [saving, setSaving] = useState(false);

  const { subtotal, tax, total } = calculateTotals(items, taxRate);

  useEffect(() => {
    fetchCustomers();
  }, []);

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
    if (!customerId || !subject) {
      toast.error('\u53D6\u5F15\u5148\u3068\u4EF6\u540D\u306F\u5FC5\u9808\u3067\u3059');
      return;
    }
    setSaving(true);

    try {
      const res = await fetch('/api/recurring', {
        method: 'POST',
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
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || '\u4FDD\u5B58\u306B\u5931\u6557\u3057\u307E\u3057\u305F');
        return;
      }

      toast.success('\u5B9A\u671F\u8ACB\u6C42\u3092\u4F5C\u6210\u3057\u307E\u3057\u305F');
      router.push('/recurring');
    } catch {
      toast.error('\u4FDD\u5B58\u306B\u5931\u6557\u3057\u307E\u3057\u305F');
    } finally {
      setSaving(false);
    }
  }

  const filteredCustomers = customerSearch
    ? customers.filter((c) =>
        c.company_name.toLowerCase().includes(customerSearch.toLowerCase())
      )
    : customers;

  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/recurring')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{'\u5B9A\u671F\u8ACB\u6C42\u3092\u4F5C\u6210'}</h1>
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
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
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

            <div className="mt-4">
              <Button
                className="w-full"
                disabled={saving || !customerId || !subject}
                onClick={handleSave}
              >
                <Save className="h-4 w-4 mr-2" />
                {'\u4FDD\u5B58'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
