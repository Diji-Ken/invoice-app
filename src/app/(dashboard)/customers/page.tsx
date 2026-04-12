'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import { useOrg } from '@/lib/org-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Customer } from '@/lib/types';

const paymentMethodLabels: Record<string, string> = {
  bank_transfer: '\u9280\u884C\u632F\u8FBC',
  credit: '\u30AF\u30EC\u30B8\u30C3\u30C8\u6C7A\u6E08',
  cash: '\u73FE\u91D1',
  other: '\u305D\u306E\u4ED6',
};

export default function CustomersPage() {
  const { org, loading: orgLoading } = useOrg();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (orgLoading || !org) return;

    async function fetchCustomers() {
      try {
        const res = await fetch('/api/customers');
        if (res.ok) {
          const data = await res.json();
          setCustomers(data.customers ?? []);
        }
      } catch (err) {
        console.error('Failed to fetch customers:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, [org, orgLoading]);

  const filtered = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter((c) =>
      c.company_name.toLowerCase().includes(q)
    );
  }, [customers, search]);

  if (orgLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">
          {'\u8AAD\u307F\u8FBC\u307F\u4E2D...'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{'\u53D6\u5F15\u5148'}</h1>
        <Button render={<Link href="/customers/new" />} className="w-full sm:w-auto">
          <Plus className="size-4 mr-1" />
          {'\u65B0\u898F\u4F5C\u6210'}
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-4 sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={'\u4F1A\u793E\u540D\u3067\u691C\u7D22'}
          className="pl-9"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border bg-white py-16 text-center">
          <p className="text-sm text-muted-foreground">
            {customers.length === 0
              ? '\u53D6\u5F15\u5148\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093'
              : '\u691C\u7D22\u7D50\u679C\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-lg border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{'\u4F1A\u793E\u540D'}</TableHead>
                  <TableHead>{'\u62C5\u5F53\u8005'}</TableHead>
                  <TableHead>{'\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9'}</TableHead>
                  <TableHead>{'\u652F\u6255\u65B9\u6CD5'}</TableHead>
                  <TableHead>{'\u30B9\u30C6\u30FC\u30BF\u30B9'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/customers/${customer.id}`)}
                  >
                    <TableCell className="font-medium">
                      {customer.company_name}
                    </TableCell>
                    <TableCell>
                      {customer.contact_person || '-'}
                    </TableCell>
                    <TableCell>
                      {customer.email || '-'}
                    </TableCell>
                    <TableCell>
                      {paymentMethodLabels[customer.payment_method] ??
                        customer.payment_method}
                    </TableCell>
                    <TableCell>
                      {customer.is_active ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {'\u30A2\u30AF\u30C6\u30A3\u30D6'}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          {'\u7121\u52B9'}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((customer) => (
              <Card
                key={customer.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => router.push(`/customers/${customer.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 space-y-0.5">
                      <p className="truncate text-sm font-bold">
                        {customer.company_name}
                      </p>
                      {customer.contact_person && (
                        <p className="truncate text-xs text-muted-foreground">
                          {customer.contact_person}
                        </p>
                      )}
                      {customer.email && (
                        <p className="truncate text-xs text-muted-foreground">
                          {customer.email}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0">
                      {customer.is_active ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {'\u30A2\u30AF\u30C6\u30A3\u30D6'}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          {'\u7121\u52B9'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {paymentMethodLabels[customer.payment_method] ??
                      customer.payment_method}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
