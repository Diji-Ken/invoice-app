'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
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
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type FormData = {
  email_subject_template: string;
  email_body_template: string;
  sender_email: string;
  pdf_style: string;
  invoice_number_prefix: string;
};

const PLACEHOLDERS = [
  '{請求先会社名}',
  '{請求先担当者名}',
  '{商品名}',
  '{支払期限}',
  '{取引日}',
  '{月}',
  '{請求金額}',
  '{請求書ファイル名}',
  '{請求元会社名}',
  '{請求元担当者名}',
  '{請求元電話番号}',
  '{請求元メールアドレス}',
];

const initialForm: FormData = {
  email_subject_template: '',
  email_body_template: '',
  sender_email: '',
  pdf_style: 'standard',
  invoice_number_prefix: 'INV-',
};

export default function InvoiceSettingsPage() {
  const { org, settings, loading, reload } = useOrg();
  const [form, setForm] = useState<FormData>(initialForm);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (settings) {
      setForm({
        email_subject_template: settings.email_subject_template ?? '',
        email_body_template: settings.email_body_template ?? '',
        sender_email: settings.sender_email ?? '',
        pdf_style: settings.pdf_style ?? 'standard',
        invoice_number_prefix: settings.invoice_number_prefix ?? 'INV-',
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
          email_subject_template: form.email_subject_template || null,
          email_body_template: form.email_body_template || null,
          sender_email: form.sender_email || null,
          pdf_style: form.pdf_style,
          invoice_number_prefix: form.invoice_number_prefix,
        })
        .eq('organization_id', org.id);

      if (error) throw error;

      toast.success('保存しました');
      await reload();
    } catch {
      toast.error('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">請求書設定</h2>

      {/* Email template */}
      <Card>
        <CardHeader>
          <CardTitle>メールテンプレート</CardTitle>
          <CardDescription>
            請求書送信時のメール件名・本文テンプレートを設定します。空欄の場合はデフォルトが使用されます。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label>件名テンプレート</Label>
            <Input
              value={form.email_subject_template}
              onChange={(e) => updateField('email_subject_template', e.target.value)}
              placeholder="{月}月分請求書_{商品名}_{請求先会社名}御中"
            />
          </div>
          <div className="space-y-2">
            <Label>本文テンプレート</Label>
            <Textarea
              value={form.email_body_template}
              onChange={(e) => updateField('email_body_template', e.target.value)}
              rows={8}
              placeholder="空欄の場合はデフォルトのテンプレートが使用されます"
            />
          </div>
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              利用可能なプレースホルダー
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PLACEHOLDERS.map((p) => (
                <code
                  key={p}
                  className="rounded bg-background px-1.5 py-0.5 text-xs ring-1 ring-foreground/10"
                >
                  {p}
                </code>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sender settings */}
      <Card>
        <CardHeader>
          <CardTitle>送信設定</CardTitle>
          <CardDescription>
            請求書メールの送信元アドレスを設定します。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>送信元メールアドレス</Label>
            <Input
              type="email"
              value={form.sender_email}
              onChange={(e) => updateField('sender_email', e.target.value)}
              placeholder="billing@example.com"
            />
            <p className="text-xs text-muted-foreground">
              空欄の場合は会社設定のメールアドレスが使用されます。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* PDF settings */}
      <Card>
        <CardHeader>
          <CardTitle>PDF設定</CardTitle>
          <CardDescription>
            請求書PDFのスタイルを選択します。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>PDFスタイル</Label>
            <Select
              value={form.pdf_style}
              onValueChange={(val) => val && updateField('pdf_style', val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">スタンダード</SelectItem>
                <SelectItem value="aomidori">青緑アクセント</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoice number */}
      <Card>
        <CardHeader>
          <CardTitle>請求書番号</CardTitle>
          <CardDescription>
            請求書番号のプレフィックスと現在の連番を確認できます。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>プレフィックス</Label>
            <Input
              value={form.invoice_number_prefix}
              onChange={(e) => updateField('invoice_number_prefix', e.target.value)}
              placeholder="INV-"
            />
          </div>
          <div className="space-y-2">
            <Label>次の連番</Label>
            <Input
              value={settings?.next_invoice_seq?.toString() ?? '---'}
              readOnly
              disabled
              className="tabular-nums"
            />
            <p className="text-xs text-muted-foreground">
              自動的にインクリメントされます。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? '保存中...' : '保存'}
        </Button>
      </div>
    </div>
  );
}
