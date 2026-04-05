'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useOrg } from '@/lib/org-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function OnboardingPage() {
  const router = useRouter();
  const { org, settings, loading: orgLoading } = useOrg();
  const [loading, setLoading] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankBranch, setBankBranch] = useState('');
  const [bankAccountType, setBankAccountType] = useState('普通');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankAccountHolder, setBankAccountHolder] = useState('');

  useEffect(() => {
    if (!orgLoading && !org) {
      router.push('/signup');
    }
  }, [orgLoading, org, router]);

  useEffect(() => {
    if (settings) {
      setCompanyName(settings.company_name ?? '');
      setRepresentativeName(settings.representative_name ?? '');
      setPostalCode(settings.postal_code ?? '');
      setAddressLine1(settings.address_line1 ?? '');
      setAddressLine2(settings.address_line2 ?? '');
      setPhone(settings.phone ?? '');
      setEmail(settings.email ?? '');
      setRegistrationNumber(settings.registration_number ?? '');
      setBankName(settings.bank_name ?? '');
      setBankBranch(settings.bank_branch ?? '');
      setBankAccountType(settings.bank_account_type ?? '普通');
      setBankAccountNumber(settings.bank_account_number ?? '');
      setBankAccountHolder(settings.bank_account_holder ?? '');
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase
      .from('company_settings')
      .update({
        company_name: companyName,
        representative_name: representativeName || null,
        postal_code: postalCode || null,
        address_line1: addressLine1 || null,
        address_line2: addressLine2 || null,
        phone: phone || null,
        email: email || null,
        registration_number: registrationNumber || null,
        bank_name: bankName || null,
        bank_branch: bankBranch || null,
        bank_account_type: bankAccountType || null,
        bank_account_number: bankAccountNumber || null,
        bank_account_holder: bankAccountHolder || null,
      })
      .eq('organization_id', org.id);

    if (error) {
      toast.error('設定の保存に失敗しました', {
        description: error.message,
      });
      setLoading(false);
      return;
    }

    toast.success('会社情報を保存しました');
    router.push('/dashboard');
  };

  if (orgLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">読み込み中...</p>
        </CardContent>
      </Card>
    );
  }

  if (!org) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          会社情報を設定
        </CardTitle>
        <CardDescription>
          請求書に表示される会社情報を入力してください。後から設定画面で変更できます。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* 基本情報 */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold border-b pb-2">
              基本情報
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="companyName">会社名</Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="株式会社サンプル"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="representativeName">代表者名</Label>
                <Input
                  id="representativeName"
                  type="text"
                  placeholder="山田 太郎"
                  value={representativeName}
                  onChange={(e) => setRepresentativeName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="postalCode">郵便番号</Label>
                <Input
                  id="postalCode"
                  type="text"
                  placeholder="100-0001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">電話番号</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="03-1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="addressLine1">住所1</Label>
                <Input
                  id="addressLine1"
                  type="text"
                  placeholder="東京都千代田区丸の内1-1-1"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="addressLine2">住所2（建物名など）</Label>
                <Input
                  id="addressLine2"
                  type="text"
                  placeholder="サンプルビル 3F"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="info@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="registrationNumber">登録番号（インボイス制度）</Label>
                <Input
                  id="registrationNumber"
                  type="text"
                  placeholder="T1234567890123"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 銀行口座情報 */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold border-b pb-2">
              銀行口座情報
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="bankName">銀行名</Label>
                <Input
                  id="bankName"
                  type="text"
                  placeholder="三菱UFJ銀行"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="bankBranch">支店名</Label>
                <Input
                  id="bankBranch"
                  type="text"
                  placeholder="丸の内支店"
                  value={bankBranch}
                  onChange={(e) => setBankBranch(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="bankAccountType">口座種別</Label>
                <Select value={bankAccountType} onValueChange={(v) => { if (v) setBankAccountType(v); }}>
                  <SelectTrigger id="bankAccountType" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="普通">普通</SelectItem>
                    <SelectItem value="当座">当座</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="bankAccountNumber">口座番号</Label>
                <Input
                  id="bankAccountNumber"
                  type="text"
                  placeholder="1234567"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="bankAccountHolder">口座名義</Label>
                <Input
                  id="bankAccountHolder"
                  type="text"
                  placeholder="カ）サンプル"
                  value={bankAccountHolder}
                  onChange={(e) => setBankAccountHolder(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '保存中...' : '設定を完了'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
