'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PROVIDER_PRESETS,
  type EmailProvider,
  type ProviderPreset,
} from '@/lib/email/providers';

type FormState = {
  provider: EmailProvider;
  smtp_host: string;
  smtp_port: number;
  smtp_secure: boolean;
  smtp_user: string;
  smtp_password: string;
  from_name: string;
  from_address: string;
  reply_to: string;
};

type StatusState = {
  verified: boolean;
  verified_at: string | null;
  last_test_at: string | null;
  last_test_error: string | null;
};

const initialForm: FormState = {
  provider: 'none',
  smtp_host: '',
  smtp_port: 587,
  smtp_secure: true,
  smtp_user: '',
  smtp_password: '',
  from_name: '',
  from_address: '',
  reply_to: '',
};

function formatDateTime(iso: string | null): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${y}/${m}/${day} ${hh}:${mm}`;
  } catch {
    return iso;
  }
}

export default function EmailSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<StatusState>({
    verified: false,
    verified_at: null,
    last_test_at: null,
    last_test_error: null,
  });

  // Track whether the user has manually edited from_address so we don't
  // clobber their input when they retype smtp_user
  const fromAddressTouched = useRef(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/email-config');
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || '\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557\u3057\u307E\u3057\u305F');
        }
        const data = await res.json();
        if (cancelled) return;
        const cfg = data.config ?? {};
        setHasPassword(!!data.hasPassword);
        setRole(data.role ?? null);
        setForm({
          provider: (cfg.provider as EmailProvider) || 'none',
          smtp_host: cfg.smtp_host ?? '',
          smtp_port: cfg.smtp_port ?? 587,
          smtp_secure: cfg.smtp_secure ?? true,
          smtp_user: cfg.smtp_user ?? '',
          smtp_password: '',
          from_name: cfg.from_name ?? '',
          from_address: cfg.from_address ?? '',
          reply_to: cfg.reply_to ?? '',
        });
        // Consider from_address "touched" if it differs from smtp_user on load
        fromAddressTouched.current =
          !!cfg.from_address && cfg.from_address !== cfg.smtp_user;
        setStatus({
          verified: !!cfg.verified,
          verified_at: cfg.verified_at ?? null,
          last_test_at: cfg.last_test_at ?? null,
          last_test_error: cfg.last_test_error ?? null,
        });
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : '\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557\u3057\u307E\u3057\u305F';
        toast.error(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const canEdit = role === 'owner' || role === 'admin';
  const preset: ProviderPreset | null =
    form.provider !== 'none' ? PROVIDER_PRESETS[form.provider] : null;
  const hostEditable =
    form.provider === 'xserver' || form.provider === 'custom_smtp';

  function handleProviderChange(nextProvider: EmailProvider) {
    if (nextProvider === 'none') {
      setForm((prev) => ({
        ...prev,
        provider: 'none',
        smtp_host: '',
        smtp_port: 587,
        smtp_secure: true,
      }));
      return;
    }
    const p = PROVIDER_PRESETS[nextProvider];
    setForm((prev) => ({
      ...prev,
      provider: nextProvider,
      smtp_host: p.smtp_host || '',
      smtp_port: p.smtp_port,
      smtp_secure: p.smtp_secure,
    }));
  }

  function updateSmtpUser(value: string) {
    setForm((prev) => {
      const nextFromAddress = fromAddressTouched.current
        ? prev.from_address
        : value;
      return { ...prev, smtp_user: value, from_address: nextFromAddress };
    });
  }

  function updateFromAddress(value: string) {
    fromAddressTouched.current = true;
    setForm((prev) => ({ ...prev, from_address: value }));
  }

  async function handleSave() {
    if (!canEdit) return;
    setSaving(true);
    try {
      const payload = {
        provider: form.provider,
        smtp_host: form.smtp_host,
        smtp_port: Number(form.smtp_port) || 587,
        smtp_secure: form.smtp_secure,
        smtp_user: form.smtp_user,
        smtp_password: form.smtp_password, // empty means "keep existing"
        from_name: form.from_name,
        from_address: form.from_address || form.smtp_user,
        reply_to: form.reply_to,
      };
      const res = await fetch('/api/email-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '\u4FDD\u5B58\u306B\u5931\u6557\u3057\u307E\u3057\u305F');
      }
      const cfg = data.config ?? {};
      setHasPassword(!!data.hasPassword);
      setForm((prev) => ({
        ...prev,
        smtp_host: cfg.smtp_host ?? prev.smtp_host,
        smtp_port: cfg.smtp_port ?? prev.smtp_port,
        smtp_secure: cfg.smtp_secure ?? prev.smtp_secure,
        smtp_user: cfg.smtp_user ?? prev.smtp_user,
        smtp_password: '',
        from_name: cfg.from_name ?? '',
        from_address: cfg.from_address ?? '',
        reply_to: cfg.reply_to ?? '',
      }));
      setStatus({
        verified: !!cfg.verified,
        verified_at: cfg.verified_at ?? null,
        last_test_at: cfg.last_test_at ?? null,
        last_test_error: cfg.last_test_error ?? null,
      });
      toast.success('\u4FDD\u5B58\u3057\u307E\u3057\u305F');
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : '\u4FDD\u5B58\u306B\u5931\u6557\u3057\u307E\u3057\u305F';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    if (!canEdit) return;
    setTesting(true);
    try {
      const res = await fetch('/api/email-config/test', { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        const errMsg =
          data.error ||
          '\u63A5\u7D9A\u30C6\u30B9\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F';
        setStatus((prev) => ({
          ...prev,
          verified: false,
          last_test_at: new Date().toISOString(),
          last_test_error: errMsg,
        }));
        toast.error(errMsg);
        return;
      }
      const now = new Date().toISOString();
      setStatus({
        verified: true,
        verified_at: now,
        last_test_at: now,
        last_test_error: null,
      });
      toast.success(
        data.sentTo
          ? `\u63A5\u7D9AOK\u3002\u30C6\u30B9\u30C8\u30E1\u30FC\u30EB\u3092 ${data.sentTo} \u306B\u9001\u4FE1\u3057\u307E\u3057\u305F`
          : '\u63A5\u7D9AOK'
      );
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : '\u63A5\u7D9A\u30C6\u30B9\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F';
      toast.error(msg);
    } finally {
      setTesting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        <span className="ml-2 text-sm text-muted-foreground">
          {'\u8AAD\u307F\u8FBC\u307F\u4E2D...'}
        </span>
      </div>
    );
  }

  // Status card visuals
  let statusCard: React.ReactNode;
  if (status.verified) {
    statusCard = (
      <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
        <div className="text-sm">
          <p className="font-medium text-green-900">
            {'\u63A5\u7D9AOK'}
          </p>
          <p className="text-green-700">
            {'\u6700\u7D42\u78BA\u8A8D: '}
            {formatDateTime(status.verified_at || status.last_test_at)}
          </p>
        </div>
      </div>
    );
  } else if (status.last_test_error) {
    statusCard = (
      <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
        <div className="text-sm">
          <p className="font-medium text-red-900">
            {'\u30A8\u30E9\u30FC: '}
            {status.last_test_error}
          </p>
          {status.last_test_at && (
            <p className="text-red-700">
              {formatDateTime(status.last_test_at)}
            </p>
          )}
        </div>
      </div>
    );
  } else if (form.provider === 'none') {
    statusCard = (
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div className="text-sm">
          <p className="font-medium text-amber-900">{'\u672A\u8A2D\u5B9A'}</p>
          <p className="text-amber-700">
            {'\u30E1\u30FC\u30EB\u9001\u4FE1\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044'}
          </p>
        </div>
      </div>
    );
  } else {
    statusCard = (
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div className="text-sm">
          <p className="font-medium text-amber-900">
            {'\u672A\u78BA\u8A8D'}
          </p>
          <p className="text-amber-700">
            {'\u8A2D\u5B9A\u3092\u4FDD\u5B58\u5F8C\u3001\u300C\u63A5\u7D9A\u30C6\u30B9\u30C8\u300D\u3067\u52D5\u4F5C\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">
          {'\u30E1\u30FC\u30EB\u9001\u4FE1\u8A2D\u5B9A'}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {'\u8ACB\u6C42\u66F8\u30E1\u30FC\u30EB\u306E\u9001\u4FE1\u5143\u3092\u8A2D\u5B9A\u3057\u307E\u3059'}
        </p>
      </div>

      {statusCard}

      {!canEdit && (
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
          <p>
            {'\u3053\u306E\u8A2D\u5B9A\u3092\u5909\u66F4\u3059\u308B\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093'}
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{'SMTP\u8A2D\u5B9A'}</CardTitle>
          <CardDescription>
            {'\u5229\u7528\u4E2D\u306E\u30E1\u30FC\u30EB\u30B5\u30FC\u30D3\u30B9\u3092\u9078\u3093\u3067\u3001\u63A5\u7D9A\u60C5\u5831\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>{'\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC'}</Label>
            <Select
              value={form.provider}
              onValueChange={(val) => {
                if (!val) return;
                handleProviderChange(val as EmailProvider);
              }}
              disabled={!canEdit}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  {'\u8A2D\u5B9A\u3057\u306A\u3044'}
                </SelectItem>
                {(Object.keys(PROVIDER_PRESETS) as EmailProvider[]).map(
                  (key) => {
                    if (key === 'none') return null;
                    const p = PROVIDER_PRESETS[key as Exclude<EmailProvider, 'none'>];
                    return (
                      <SelectItem key={key} value={key}>
                        {p.label}
                      </SelectItem>
                    );
                  }
                )}
              </SelectContent>
            </Select>
            {preset?.help_text && (
              <p className="text-xs text-gray-500">{preset.help_text}</p>
            )}
            {preset?.help_url && (
              <Link
                href={preset.help_url}
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
              >
                {preset.label}
                {'\u306E\u8A2D\u5B9A\u65B9\u6CD5\u306F\u3053\u3061\u3089'}
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}
          </div>

          {form.provider !== 'none' && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>{'SMTP\u30DB\u30B9\u30C8'}</Label>
                  <Input
                    value={form.smtp_host}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        smtp_host: e.target.value,
                      }))
                    }
                    readOnly={!hostEditable || !canEdit}
                    className={!hostEditable ? 'bg-gray-50' : undefined}
                    placeholder={
                      form.provider === 'xserver'
                        ? 'sv1234.xserver.jp'
                        : 'smtp.example.com'
                    }
                  />
                  {!hostEditable && (
                    <p className="text-xs text-gray-500">
                      {'\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u306B\u5FDC\u3058\u305F\u5024\u304C\u81EA\u52D5\u3067\u8A2D\u5B9A\u3055\u308C\u307E\u3059'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{'\u30DD\u30FC\u30C8'}</Label>
                  <Input
                    type="number"
                    value={form.smtp_port}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        smtp_port: Number(e.target.value) || 0,
                      }))
                    }
                    disabled={!canEdit}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{'\u30BB\u30AD\u30E5\u30A2\u63A5\u7D9A'}</Label>
                  <Select
                    value={form.smtp_secure ? 'ssl' : 'starttls'}
                    onValueChange={(val) => {
                      if (!val) return;
                      setForm((prev) => ({
                        ...prev,
                        smtp_secure: val === 'ssl',
                      }));
                    }}
                    disabled={!canEdit}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ssl">{'SSL/TLS'}</SelectItem>
                      <SelectItem value="starttls">{'STARTTLS'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    {preset?.user_label ||
                      '\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9'}
                  </Label>
                  <Input
                    value={form.smtp_user}
                    onChange={(e) => updateSmtpUser(e.target.value)}
                    placeholder="you@example.com"
                    disabled={!canEdit}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    {preset?.password_label ||
                      '\u30D1\u30B9\u30EF\u30FC\u30C9'}
                  </Label>
                  <Input
                    type="password"
                    value={form.smtp_password}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        smtp_password: e.target.value,
                      }))
                    }
                    placeholder={
                      hasPassword
                        ? '\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\uFF08\u5909\u66F4\u3059\u308B\u5834\u5408\u306E\u307F\u5165\u529B\uFF09'
                        : preset?.password_label ||
                          '\u30D1\u30B9\u30EF\u30FC\u30C9'
                    }
                    disabled={!canEdit}
                    autoComplete="new-password"
                  />
                  {hasPassword && !form.smtp_password && (
                    <p className="text-xs text-gray-500">
                      {'\u7A7A\u6B04\u306E\u307E\u307E\u4FDD\u5B58\u3059\u308B\u3068\u3001\u73FE\u5728\u306E\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u305D\u306E\u307E\u307E\u7DAD\u6301\u3057\u307E\u3059'}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    {'\u9001\u4FE1\u8005\u540D'}
                    <span className="ml-1 text-xs font-normal text-gray-400">
                      {'\uFF08\u4EFB\u610F\uFF09'}
                    </span>
                  </Label>
                  <Input
                    value={form.from_name}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        from_name: e.target.value,
                      }))
                    }
                    placeholder="\u682A\u5F0F\u4F1A\u793E\u25CB\u25CB"
                    disabled={!canEdit}
                  />
                  <p className="text-xs text-gray-500">
                    {'\u53D7\u4FE1\u8005\u306E\u30E1\u30FC\u30EB\u30AF\u30E9\u30A4\u30A2\u30F3\u30C8\u3067\u8868\u793A\u3055\u308C\u308B\u540D\u524D'}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>{'\u9001\u4FE1\u5143\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9'}</Label>
                  <Input
                    type="email"
                    value={form.from_address}
                    onChange={(e) => updateFromAddress(e.target.value)}
                    placeholder="you@example.com"
                    disabled={!canEdit}
                    autoComplete="email"
                  />
                  <p className="text-xs text-gray-500">
                    {'\u672A\u5165\u529B\u306E\u5834\u5408\u306F\u30ED\u30B0\u30A4\u30F3ID\u3092\u4F7F\u7528\u3057\u307E\u3059'}
                  </p>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>
                    {'\u8FD4\u4FE1\u5148\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9'}
                    <span className="ml-1 text-xs font-normal text-gray-400">
                      {'\uFF08\u4EFB\u610F\uFF09'}
                    </span>
                  </Label>
                  <Input
                    type="email"
                    value={form.reply_to}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        reply_to: e.target.value,
                      }))
                    }
                    placeholder="reply@example.com"
                    disabled={!canEdit}
                    autoComplete="email"
                  />
                  <p className="text-xs text-gray-500">
                    {'\u53D7\u4FE1\u8005\u304C\u300C\u8FD4\u4FE1\u300D\u3057\u305F\u3068\u304D\u306B\u9001\u3089\u308C\u308B\u5148\u3002\u672A\u5165\u529B\u306E\u5834\u5408\u306F\u9001\u4FE1\u5143\u30A2\u30C9\u30EC\u30B9\u306B\u8FD4\u4FE1\u3055\u308C\u307E\u3059'}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleTest}
              disabled={
                !canEdit || testing || saving || form.provider === 'none'
              }
            >
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {'\u30C6\u30B9\u30C8\u4E2D...'}
                </>
              ) : (
                '\u63A5\u7D9A\u30C6\u30B9\u30C8'
              )}
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!canEdit || saving || testing}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {'\u4FDD\u5B58\u4E2D...'}
                </>
              ) : (
                '\u4FDD\u5B58'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
