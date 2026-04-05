import {
  FileText,
  Building2,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';

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

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get current user's org
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let monthlyRevenue = 0;
  let outstandingAmount = 0;
  let invoiceCount = 0;
  let customerCount = 0;
  let recentInvoices: Array<{
    id: string;
    invoice_number: string;
    customer_name: string;
    total: number;
    status: string;
    issue_date: string;
  }> = [];

  if (user) {
    // Get user's org
    const { data: membership } = await supabase
      .from('org_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    if (membership) {
      const orgId = membership.organization_id;

      // Current month range
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split('T')[0];
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .split('T')[0];

      // Monthly revenue (paid invoices this month)
      const { data: paidInvoices } = await supabase
        .from('invoices')
        .select('total')
        .eq('organization_id', orgId)
        .eq('status', 'paid')
        .gte('paid_at', monthStart)
        .lte('paid_at', monthEnd + 'T23:59:59');

      monthlyRevenue = (paidInvoices ?? []).reduce(
        (sum, inv) => sum + (inv.total ?? 0),
        0
      );

      // Outstanding (sent + overdue)
      const { data: outstandingInvoices } = await supabase
        .from('invoices')
        .select('total')
        .eq('organization_id', orgId)
        .in('status', ['sent', 'overdue', 'issued']);

      outstandingAmount = (outstandingInvoices ?? []).reduce(
        (sum, inv) => sum + (inv.total ?? 0),
        0
      );

      // Total invoice count
      const { count } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId);

      invoiceCount = count ?? 0;

      // Active customer count
      const { count: custCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId)
        .eq('is_active', true);

      customerCount = custCount ?? 0;

      // Recent invoices with customer name
      const { data: recent } = await supabase
        .from('invoices')
        .select('id, invoice_number, total, status, issue_date, customers(company_name)')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false })
        .limit(5);

      recentInvoices = (recent ?? []).map((inv) => ({
        id: inv.id,
        invoice_number: inv.invoice_number,
        customer_name:
          (inv.customers as unknown as { company_name: string })
            ?.company_name ?? '-',
        total: inv.total,
        status: inv.status,
        issue_date: inv.issue_date,
      }));
    }
  }

  const stats = [
    {
      label: '\u4ECA\u6708\u306E\u58F2\u4E0A',
      value: formatCurrency(monthlyRevenue),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: '\u672A\u56DE\u53CE\u984D',
      value: formatCurrency(outstandingAmount),
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: '\u8ACB\u6C42\u66F8\u6570',
      value: invoiceCount.toLocaleString(),
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: '\u53D6\u5F15\u5148\u6570',
      value: customerCount.toLocaleString(),
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {'\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9'}
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className={`rounded-md p-2 ${stat.bgColor}`}>
                  <Icon className={`size-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent invoices */}
      <Card>
        <CardHeader>
          <CardTitle>{'\u6700\u8FD1\u306E\u8ACB\u6C42\u66F8'}</CardTitle>
        </CardHeader>
        <CardContent>
          {recentInvoices.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {'\u8ACB\u6C42\u66F8\u304C\u307E\u3060\u3042\u308A\u307E\u305B\u3093'}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{'\u8ACB\u6C42\u66F8\u756A\u53F7'}</TableHead>
                  <TableHead>{'\u53D6\u5F15\u5148'}</TableHead>
                  <TableHead className="text-right">{'\u91D1\u984D'}</TableHead>
                  <TableHead>{'\u30B9\u30C6\u30FC\u30BF\u30B9'}</TableHead>
                  <TableHead>{'\u767A\u884C\u65E5'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.invoice_number}
                    </TableCell>
                    <TableCell>{invoice.customer_name}</TableCell>
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
