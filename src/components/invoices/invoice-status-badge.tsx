'use client';

import { Badge } from '@/components/ui/badge';
import type { InvoiceStatus } from '@/lib/types';

const statusConfig: Record<InvoiceStatus, { label: string; className: string }> = {
  draft: { label: '下書き', className: 'bg-gray-100 text-gray-600 hover:bg-gray-100' },
  issued: { label: '発行済', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
  sent: { label: '送信済', className: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100' },
  paid: { label: '入金済', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  cancelled: { label: 'キャンセル', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
  overdue: { label: '期限超過', className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const config = statusConfig[status] || statusConfig.draft;
  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
}
