'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useOrg } from '@/lib/org-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

type FormData = {
  company_name: string;
  contact_person: string;
  email: string;
  postal_code: string;
  address: string;
  payment_method: string;
  notes: string;
};

const initialForm: FormData = {
  company_name: '',
  contact_person: '',
  email: '',
  postal_code: '',
  address: '',
  payment_method: 'bank_transfer',
  notes: '',
};

export default function NewCustomerPage() {
  const { loading: orgLoading } = useOrg();
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialForm);
  const [saving, setSaving] = useState(false);

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
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '\u4FDD\u5B58\u306B\u5931\u6557\u3057\u307E\u3057\u305F');
      }

      toast.success('\u53D6\u5F15\u5148\u3092\u4F5C\u6210\u3057\u307E\u3057\u305F');
      router.push('/customers');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : '\u4FDD\u5B58\u306B\u5931\u6557\u3057\u307E\u3057\u305F'
      );
    } finally {
      setSaving(false);
    }
  }

  if (orgLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">
          {'\u8AAD\u307F\u8FBC\u307F\u4E2D...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {'\u53D6\u5F15\u5148\u3092\u8FFD\u52A0'}
        </h1>
      </div>

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

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button
          variant="outline"
          render={<Link href="/customers" />}
          className="w-full sm:w-auto"
        >
          {'\u30AD\u30E3\u30F3\u30BB\u30EB'}
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto"
        >
          {saving ? '\u4FDD\u5B58\u4E2D...' : '\u4FDD\u5B58'}
        </Button>
      </div>
    </div>
  );
}
