'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useOrg } from '@/lib/org-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CompanySettings } from '@/lib/types';

type FormData = {
  company_name: string;
  representative_name: string;
  postal_code: string;
  address_line1: string;
  address_line2: string;
  phone: string;
  email: string;
  registration_number: string;
  bank_name: string;
  bank_branch: string;
  bank_account_type: string;
  bank_account_number: string;
  bank_account_holder: string;
  invoice_number_prefix: string;
  pdf_style: string;
};

const initialForm: FormData = {
  company_name: '',
  representative_name: '',
  postal_code: '',
  address_line1: '',
  address_line2: '',
  phone: '',
  email: '',
  registration_number: '',
  bank_name: '',
  bank_branch: '',
  bank_account_type: '\u666E\u901A',
  bank_account_number: '',
  bank_account_holder: '',
  invoice_number_prefix: 'INV-',
  pdf_style: 'standard',
};

export default function CompanySettingsPage() {
  const { org, settings, loading, reload } = useOrg();
  const [form, setForm] = useState<FormData>(initialForm);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  // Populate form when settings load
  useEffect(() => {
    if (settings) {
      setForm({
        company_name: settings.company_name ?? '',
        representative_name: settings.representative_name ?? '',
        postal_code: settings.postal_code ?? '',
        address_line1: settings.address_line1 ?? '',
        address_line2: settings.address_line2 ?? '',
        phone: settings.phone ?? '',
        email: settings.email ?? '',
        registration_number: settings.registration_number ?? '',
        bank_name: settings.bank_name ?? '',
        bank_branch: settings.bank_branch ?? '',
        bank_account_type: settings.bank_account_type ?? '\u666E\u901A',
        bank_account_number: settings.bank_account_number ?? '',
        bank_account_holder: settings.bank_account_holder ?? '',
        invoice_number_prefix: settings.invoice_number_prefix ?? 'INV-',
        pdf_style: settings.pdf_style ?? 'standard',
      });
    }
  }, [settings]);

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!org) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('company_settings')
        .update({
          company_name: form.company_name,
          representative_name: form.representative_name || null,
          postal_code: form.postal_code || null,
          address_line1: form.address_line1 || null,
          address_line2: form.address_line2 || null,
          phone: form.phone || null,
          email: form.email || null,
          registration_number: form.registration_number || null,
          bank_name: form.bank_name || null,
          bank_branch: form.bank_branch || null,
          bank_account_type: form.bank_account_type || null,
          bank_account_number: form.bank_account_number || null,
          bank_account_holder: form.bank_account_holder || null,
          invoice_number_prefix: form.invoice_number_prefix,
          pdf_style: form.pdf_style,
        })
        .eq('organization_id', org.id);

      if (error) throw error;

      toast.success('\u4FDD\u5B58\u3057\u307E\u3057\u305F');
      await reload();
    } catch {
      toast.error('\u4FDD\u5B58\u306B\u5931\u6557\u3057\u307E\u3057\u305F');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">{'\u8AAD\u307F\u8FBC\u307F\u4E2D...'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Basic info */}
      <Card>
        <CardHeader>
          <CardTitle>{'\u57FA\u672C\u60C5\u5831'}</CardTitle>
          <CardDescription>
            {'\u8ACB\u6C42\u66F8\u306B\u8868\u793A\u3055\u308C\u308B\u4F1A\u793E\u60C5\u5831\u3092\u8A2D\u5B9A\u3057\u307E\u3059'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>{'\u4F1A\u793E\u540D'}</Label>
            <Input
              value={form.company_name}
              onChange={(e) => updateField('company_name', e.target.value)}
              placeholder="\u682A\u5F0F\u4F1A\u793E\u25CB\u25CB"
            />
          </div>
          <div className="space-y-2">
            <Label>{'\u4EE3\u8868\u8005\u540D'}</Label>
            <Input
              value={form.representative_name}
              onChange={(e) => updateField('representative_name', e.target.value)}
              placeholder="\u5C71\u7530 \u592A\u90CE"
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
          <div className="space-y-2 sm:col-span-2">
            <Label>{'\u4F4F\u6240 1'}</Label>
            <Input
              value={form.address_line1}
              onChange={(e) => updateField('address_line1', e.target.value)}
              placeholder="\u6771\u4EAC\u90FD\u5343\u4EE3\u7530\u533A..."
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>{'\u4F4F\u6240 2'}</Label>
            <Input
              value={form.address_line2}
              onChange={(e) => updateField('address_line2', e.target.value)}
              placeholder="\u25CB\u25CB\u30D3\u30EB 3F"
            />
          </div>
          <div className="space-y-2">
            <Label>{'\u96FB\u8A71\u756A\u53F7'}</Label>
            <Input
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="03-1234-5678"
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
          <div className="space-y-2 sm:col-span-2">
            <Label>{'\u9069\u683C\u8ACB\u6C42\u66F8\u767A\u884C\u4E8B\u696D\u8005\u767B\u9332\u756A\u53F7'}</Label>
            <Input
              value={form.registration_number}
              onChange={(e) => updateField('registration_number', e.target.value)}
              placeholder="T1234567890123"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bank info */}
      <Card>
        <CardHeader>
          <CardTitle>{'\u9280\u884C\u53E3\u5EA7\u60C5\u5831'}</CardTitle>
          <CardDescription>
            {'\u8ACB\u6C42\u66F8\u306B\u8868\u793A\u3055\u308C\u308B\u632F\u8FBC\u5148\u60C5\u5831\u3092\u8A2D\u5B9A\u3057\u307E\u3059'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{'\u9280\u884C\u540D'}</Label>
            <Input
              value={form.bank_name}
              onChange={(e) => updateField('bank_name', e.target.value)}
              placeholder="\u25CB\u25CB\u9280\u884C"
            />
          </div>
          <div className="space-y-2">
            <Label>{'\u652F\u5E97\u540D'}</Label>
            <Input
              value={form.bank_branch}
              onChange={(e) => updateField('bank_branch', e.target.value)}
              placeholder="\u25CB\u25CB\u652F\u5E97"
            />
          </div>
          <div className="space-y-2">
            <Label>{'\u53E3\u5EA7\u7A2E\u5225'}</Label>
            <Select
              value={form.bank_account_type}
              onValueChange={(val) => val && updateField('bank_account_type', val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'\u666E\u901A'}>{'\u666E\u901A'}</SelectItem>
                <SelectItem value={'\u5F53\u5EA7'}>{'\u5F53\u5EA7'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{'\u53E3\u5EA7\u756A\u53F7'}</Label>
            <Input
              value={form.bank_account_number}
              onChange={(e) => updateField('bank_account_number', e.target.value)}
              placeholder="1234567"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>{'\u53E3\u5EA7\u540D\u7FA9'}</Label>
            <Input
              value={form.bank_account_holder}
              onChange={(e) => updateField('bank_account_holder', e.target.value)}
              placeholder="\u30AB)\u25CB\u25CB"
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoice settings */}
      <Card>
        <CardHeader>
          <CardTitle>{'\u8ACB\u6C42\u66F8\u8A2D\u5B9A'}</CardTitle>
          <CardDescription>
            {'\u8ACB\u6C42\u66F8\u756A\u53F7\u306E\u5F62\u5F0F\u3084PDF\u30B9\u30BF\u30A4\u30EB\u3092\u8A2D\u5B9A\u3057\u307E\u3059'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{'\u8ACB\u6C42\u66F8\u756A\u53F7\u30D7\u30EC\u30D5\u30A3\u30C3\u30AF\u30B9'}</Label>
            <Input
              value={form.invoice_number_prefix}
              onChange={(e) => updateField('invoice_number_prefix', e.target.value)}
              placeholder="INV-"
            />
          </div>
          <div className="space-y-2">
            <Label>{'PDF\u30B9\u30BF\u30A4\u30EB'}</Label>
            <Select
              value={form.pdf_style}
              onValueChange={(val) => val && updateField('pdf_style', val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">{'\u30B9\u30BF\u30F3\u30C0\u30FC\u30C9'}</SelectItem>
                <SelectItem value="aomidori">{'\u9752\u7DD1'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? '\u4FDD\u5B58\u4E2D...' : '\u4FDD\u5B58'}
        </Button>
      </div>
    </div>
  );
}
