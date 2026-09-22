'use client';

import { useState } from 'react';
import { MessageSquare, FileText, ShieldCheck, Printer, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderChatDrawer } from '@/components/features/chat/order-chat-drawer';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { DEFAULT_FX_RATES, formatCurrency, convertCurrency } from '@/lib/currency';

interface OrderInteractiveClientProps {
  orderNumber: string;
  supplierName: string;
  orderValueUsd: number;
  locale: string;
}

export function OrderInteractiveClient({
  orderNumber,
  supplierName,
  orderValueUsd,
  locale,
}: OrderInteractiveClientProps) {
  const isArabic = locale === 'ar';
  const [isChatOpen, setIsChatOpen] = useState(false);

  const valueEgp = convertCurrency(orderValueUsd, 'USD', 'EGP');
  const valueCny = convertCurrency(orderValueUsd, 'USD', 'CNY');

  return (
    <>
      {/* Interactive Action Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-emerald-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {isArabic ? 'أدوات إدارة الصفقة الفورية' : 'Live Deal Management Suite'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isArabic 
                ? 'شات مترجم فورياً للصينية، واستخراج أوامر التوريد وشهادات الضمان'
                : 'Instant Chinese-translated chat, official Purchase Order & Escrow PDF'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Chat Button */}
          <Button
            onClick={() => setIsChatOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isArabic ? 'محادثة المصنع (ترجمة فورية 🇨🇳)' : 'Chat with Factory (Live AI 🇨🇳)'}</span>
          </Button>

          {/* Download PO */}
          <Link href={`/${locale}/dashboard/orders/${orderNumber}/document?type=po`}>
            <Button
              variant="secondary"
              size="sm"
              className="text-xs gap-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 border-slate-300 dark:border-slate-600"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>{isArabic ? 'أمر التوريد (PO PDF)' : 'Purchase Order (PDF)'}</span>
            </Button>
          </Link>

          {/* Download Escrow Certificate */}
          <Link href={`/${locale}/dashboard/orders/${orderNumber}/document?type=escrow`}>
            <Button
              variant="secondary"
              size="sm"
              className="text-xs gap-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 border-slate-300 dark:border-slate-600"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isArabic ? 'شهادة الضمان المشروط' : 'Escrow Certificate'}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Multi-Currency & FX Rate Lock Banner */}
      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {isArabic ? 'تثبيت سعر الصرف المعياري (FX Rate Lock):' : 'Fixed FX Rate Snapshot:'}
          </span>
          <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded font-mono font-bold">
            1 USD = {DEFAULT_FX_RATES.EGP} EGP
          </span>
          <span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded font-mono font-bold">
            1 USD = {DEFAULT_FX_RATES.CNY} CNY
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono font-semibold">
          <span className="text-slate-900 dark:text-white">
            ${orderValueUsd.toLocaleString()} USD
          </span>
          <span className="text-slate-400">≈</span>
          <span className="text-emerald-700 dark:text-emerald-400">
            {valueEgp.toLocaleString()} EGP
          </span>
          <span className="text-slate-400">≈</span>
          <span className="text-blue-700 dark:text-blue-400">
            ¥{valueCny.toLocaleString()} CNY
          </span>
        </div>
      </div>

      {/* Chat Drawer */}
      <OrderChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        orderNumber={orderNumber}
        partnerName={supplierName}
        partnerRole="supplier"
        currentRole="buyer"
        locale={locale}
      />
    </>
  );
}
