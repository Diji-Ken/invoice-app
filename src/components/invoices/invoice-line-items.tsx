'use client';

import { Trash2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { calculateTotals, fmtCurrency, emptyItem } from '@/lib/invoice-helpers';
import type { InvoiceItem } from '@/lib/types';

interface InvoiceLineItemsProps {
  items: InvoiceItem[];
  onChange: (items: InvoiceItem[]) => void;
  taxRate: number;
}

export function InvoiceLineItems({
  items,
  onChange,
  taxRate,
}: InvoiceLineItemsProps) {
  const { subtotal, tax, total } = calculateTotals(items, taxRate);

  function updateItem(index: number, field: keyof InvoiceItem, value: string | number) {
    const updated = items.map((item, i) => {
      if (i !== index) return item;
      const newItem = { ...item, [field]: value };
      // Recalculate line price
      const qty = field === 'quantity' ? Number(value) : (newItem.quantity ?? 0);
      const price = field === 'unit_price' ? Number(value) : (newItem.unit_price ?? 0);
      newItem.price = qty * price;
      return newItem;
    });
    onChange(updated);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...items, emptyItem()]);
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="hidden sm:grid sm:grid-cols-[1fr_80px_120px_120px_40px] gap-2 text-xs font-medium text-muted-foreground px-1">
        <span>品名</span>
        <span className="text-right">数量</span>
        <span className="text-right">単価</span>
        <span className="text-right">金額</span>
        <span />
      </div>

      {/* Rows */}
      {items.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-1 sm:grid-cols-[1fr_80px_120px_120px_40px] gap-2 items-center rounded-md border p-2 sm:border-0 sm:p-0"
        >
          <div>
            <label className="text-xs text-muted-foreground sm:hidden">品名</label>
            <Input
              value={item.name}
              onChange={(e) => updateItem(index, 'name', e.target.value)}
              placeholder="品名を入力"
              className="h-9"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground sm:hidden">数量</label>
            <Input
              type="number"
              min={0}
              value={item.quantity ?? ''}
              onChange={(e) =>
                updateItem(index, 'quantity', e.target.value === '' ? 0 : Number(e.target.value))
              }
              className="h-9 text-right"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground sm:hidden">単価</label>
            <Input
              type="number"
              min={0}
              value={item.unit_price ?? ''}
              onChange={(e) =>
                updateItem(
                  index,
                  'unit_price',
                  e.target.value === '' ? 0 : Number(e.target.value)
                )
              }
              className="h-9 text-right"
            />
          </div>
          <div className="text-right text-sm font-medium tabular-nums py-1 sm:py-0">
            <span className="text-xs text-muted-foreground sm:hidden mr-1">金額:</span>
            {fmtCurrency(item.price)}
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => removeItem(index)}
              disabled={items.length <= 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {/* Add row */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
        className="w-full sm:w-auto"
      >
        <Plus className="h-4 w-4 mr-1" />
        行を追加
      </Button>

      {/* Totals */}
      <div className="border-t pt-3 mt-4 space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">小計</span>
          <span className="tabular-nums">{fmtCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            消費税（{Math.round(taxRate * 100)}%）
          </span>
          <span className="tabular-nums">{fmtCurrency(tax)}</span>
        </div>
        <div className="flex justify-between text-base font-bold pt-1 border-t">
          <span>合計</span>
          <span className="tabular-nums">{fmtCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
