'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { fmtCurrency } from '@/lib/invoice-helpers';
import { useOrg } from '@/lib/org-context';
import type { RecurringInvoice } from '@/lib/types';

export default function RecurringPage() {
  const router = useRouter();
  const { org, loading: orgLoading } = useOrg();
  const [items, setItems] = useState<RecurringInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgLoading && org) {
      fetchRecurring();
    }
  }, [orgLoading, org]);

  async function fetchRecurring() {
    setLoading(true);
    try {
      const res = await fetch('/api/recurring');
      if (res.ok) {
        const data = await res.json();
        setItems(data.recurring_invoices ?? []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function getNextGeneration(item: RecurringInvoice): string {
    if (!item.is_active) return '-';

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    if (item.last_generated_month === currentMonth) {
      // Already generated this month, next is next month
      let year = now.getFullYear();
      let month = now.getMonth() + 2;
      if (month > 12) {
        month = 1;
        year++;
      }
      return `${year}\u5E74${month}\u6708${item.send_day}\u65E5`;
    }

    // Not yet generated this month
    if (now.getDate() <= item.send_day) {
      return `${now.getFullYear()}\u5E74${now.getMonth() + 1}\u6708${item.send_day}\u65E5`;
    }

    // This month's day has passed
    let year = now.getFullYear();
    let month = now.getMonth() + 2;
    if (month > 12) {
      month = 1;
      year++;
    }
    return `${year}\u5E74${month}\u6708${item.send_day}\u65E5`;
  }

  function calcTotal(item: RecurringInvoice): number {
    const subtotal = (item.items ?? []).reduce((sum, i) => {
      if (i.quantity == null || i.unit_price == null) return sum;
      return sum + i.quantity * i.unit_price;
    }, 0);
    const tax = Math.floor(subtotal * item.tax_rate);
    return subtotal + tax;
  }

  if (orgLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
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
        <h1 className="text-2xl font-bold">{'\u5B9A\u671F\u8ACB\u6C42'}</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchRecurring}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => router.push('/recurring/new')}>
            <Plus className="h-4 w-4 mr-2" />
            {'\u65B0\u898F\u4F5C\u6210'}
          </Button>
        </div>
      </div>

      {/* Table */}
      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {'\u5B9A\u671F\u8ACB\u6C42\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093'}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{'\u53D6\u5F15\u5148'}</TableHead>
                <TableHead>{'\u4EF6\u540D'}</TableHead>
                <TableHead className="text-center">{'\u9001\u4ED8\u65E5'}</TableHead>
                <TableHead className="text-right">{'\u91D1\u984D'}</TableHead>
                <TableHead className="text-center">{'\u30B9\u30C6\u30FC\u30BF\u30B9'}</TableHead>
                <TableHead>{'\u6B21\u56DE\u751F\u6210'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/recurring/${item.id}`)}
                >
                  <TableCell className="font-medium">
                    {(item.customer as unknown as { company_name: string })?.company_name ?? '-'}
                  </TableCell>
                  <TableCell>{item.subject}</TableCell>
                  <TableCell className="text-center">
                    {'\u6BCE\u6708'}{item.send_day}{'\u65E5'}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    ¥{fmtCurrency(calcTotal(item))}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.is_active ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {'\u30A2\u30AF\u30C6\u30A3\u30D6'}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                        {'\u505C\u6B62'}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {getNextGeneration(item)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
