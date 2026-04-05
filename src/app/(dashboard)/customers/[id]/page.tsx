'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { useOrg } from '@/lib/org-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Customer, Invoice } from '@/lib/types';

type FormData = {
  company_name: string;
  contact_person: string;
  email: string;
  postal_code: string;
  address: string;
  payment_method: string;
  notes: string;
};

const statusLabels: Record<string, string> = {
  draft: '\u4E0B\u66F8\u304D',
  issued: '\u767A\u884C\u6E08',
  sent: '\u9001\u4FE1\u6E08',
  paid: '\u5165\u91D1\u6E08',
  cancelled: '\u30AD\u30E3\u30F3\u30BB\u30EB',
  overdue: '\u671F\u9650\u8D85\u904E',
};

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'secondary',
  issued: 'outline',
  sent: 'outline',
  paid: 'default',
  cancelled: 'secondary',
  overdue: 'destructive',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { org, loading: orgLoading } = useOrg();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [form, setForm] = useState<FormData>({
    company_name: '',
    contact_person: '',
    email: '',
    postal_code: '',
    address: '',
    payment_method: 'bank_transfer',
    notes: '',
  });

  // Fetch customer and invoices
  useEffect(() => {
    if (orgLoading || !org || !id) return;

    async function fetchData() {
      try {
        const [customerRes, invoicesRes] = await Promise.all([
          fetch(`/api/customers/${id}`),
          fetch(`/api/invoices?customerId=${id}`),
        ]);

        if (customerRes.ok) {
          const data = await customerRes.json();
          const c = data.customer as Customer;
          setCustomer(c);
          setForm({
            company_name: c.company_name ?? '',
            contact_person: c.contact_person ?? '',
            email: c.email ?? '',
            postal_code: c.postal_code ?? '',
            address: c.address ?? '',
            payment_method: c.payment_method ?? 'bank_transfer',
            notes: c.notes ?? '',
          });
        }

        if (invoicesRes.ok) {
          const data = await invoicesRes.json();
          setInvoices(data.invoices ?? []);
        }
      } catch (err) {
        console.error('Failed to fetch customer:', err);
        toast.error('\u53D6\u5F15\u5148\u306E\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557\u3057\u307E\u3057\u305F');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [org, orgLoading, id]);

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.company_name.trim()) {
      toast.error('\u4F1A\u793E\u540D\u306F\u5FC5\u9808\u3067\u3059');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '\u4FDD\u5B58\u306B\u5931\u6557\u3057\u307E\u3057\u305F');
      }

      const data = await res.json();
      setCustomer(data.customer);
      toast.success('\u4FDD\u5B58\u3057\u307E\u3057\u305F');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : '\u4FDD\u5B58\u306B\u5931\u6557\u3057\u307E\u3057\u305F'
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F');
      }

      toast.success('\u53D6\u5F15\u5148\u3092\u524A\u9664\u3057\u307E\u3057\u305F');
      router.push('/customers');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : '\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F'
      );
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  }

  if (orgLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">
          {'\u8AAD\u307F\u8FBC\u307F\u4E2D...'}
        </p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <p className="text-sm text-muted-foreground">
          {'\u53D6\u5F15\u5148\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093'}
        </p>
        <Button variant="outline" render={<Link href="/customers" />}>
          {'\u4E00\u89A7\u306B\u623B\u308B'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{customer.company_name}</h1>
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogTrigger
            render={
              <Button variant="destructive" size="sm">
                <Trash2 className="size-4 mr-1" />
                {'\u524A\u9664'}
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {'\u53D6\u5F15\u5148\u3092\u524A\u9664'}
              </DialogTitle>
              <DialogDescription>
                {`\u300C${customer.company_name}\u300D\u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F\u3053\u306E\u64CD\u4F5C\u306F\u53D6\u308A\u6D88\u305B\u307E\u305B\u3093\u3002`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose
                render={
                  <Button variant="outline">
                    {'\u30AD\u30E3\u30F3\u30BB\u30EB'}
                  </Button>
                }
              />
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

      {/* Edit form */}
      <Card>
        <CardHeader>
          <CardTitle>{'\u57FA\u672C\u60C5\u5831'}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>
              {'\u4F1A\u793E\u540D'}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              value={form.company_name}
              onChange={(e) => updateField('company_name', e.target.value)}
              placeholder={'\u682A\u5F0F\u4F1A\u793E\u25CB\u25CB'}
            />
          </div>
          <div className="space-y-2">
            <Label>{'\u62C5\u5F53\u8005\u540D'}</Label>
            <Input
              value={form.contact_person}
              onChange={(e) => updateField('contact_person', e.target.value)}
              placeholder={'\u5C71\u7530 \u592A\u90CE'}
            />
          </div>
          <div className="space-y-2">
            <Label>{'\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9'}</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="info@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label>{'\u90F5\u4FBF\u756A\u53F7'}</Label>
            <Input
              value={form.postal_code}
              onChange={(e) => updateField('postal_code', e.target.value)}
              placeholder="100-0001"
            />
          </div>
          <div className="space-y-2">
            <Label>{'\u652F\u6255\u65B9\u6CD5'}</Label>
            <Select
              value={form.payment_method}
              onValueChange={(val) => val && updateField('payment_method', val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">
                  {'\u9280\u884C\u632F\u8FBC'}
                </SelectItem>
                <SelectItem value="credit">
                  {'\u30AF\u30EC\u30B8\u30C3\u30C8\u6C7A\u6E08'}
                </SelectItem>
                <SelectItem value="cash">
                  {'\u73FE\u91D1'}
                </SelectItem>
                <SelectItem value="other">
                  {'\u305D\u306E\u4ED6'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>{'\u4F4F\u6240'}</Label>
            <Input
              value={form.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder={'\u6771\u4EAC\u90FD\u5343\u4EE3\u7530\u533A...'}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>{'\u5099\u8003'}</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder={'\u5099\u8003\u3084\u30E1\u30E2\u3092\u5165\u529B'}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save / Back */}
      <div className="flex items-center gap-3 justify-end">
        <Button variant="outline" render={<Link href="/customers" />}>
          {'\u623B\u308B'}
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? '\u4FDD\u5B58\u4E2D...' : '\u4FDD\u5B58'}
        </Button>
      </div>

      {/* Invoice history */}
      <Card>
        <CardHeader>
          <CardTitle>{'\u8ACB\u6C42\u5C65\u6B74'}</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {'\u8ACB\u6C42\u5C65\u6B74\u304C\u3042\u308A\u307E\u305B\u3093'}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{'\u8ACB\u6C42\u756A\u53F7'}</TableHead>
                  <TableHead>{'\u4EF6\u540D'}</TableHead>
                  <TableHead className="text-right">{'\u91D1\u984D'}</TableHead>
                  <TableHead>{'\u30B9\u30C6\u30FC\u30BF\u30B9'}</TableHead>
                  <TableHead>{'\u767A\u884C\u65E5'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/invoices/${invoice.id}`)}
                  >
                    <TableCell className="font-medium">
                      {invoice.invoice_number}
                    </TableCell>
                    <TableCell>{invoice.subject || '-'}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(invoice.total)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[invoice.status] ?? 'secondary'}>
                        {statusLabels[invoice.status] ?? invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{invoice.issue_date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
