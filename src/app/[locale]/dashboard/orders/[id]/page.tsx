import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DealProgress } from '@/components/ui/deal-progress';
import { VerificationBadge } from '@/components/ui/verification-badge';
import { OrderInteractiveClient } from '@/components/features/orders/order-interactive-client';
import { CustomsTrackerCard } from '@/components/features/shipping/customs-tracker-card';
import Link from 'next/link';

export default async function OrderDetailPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('OrderDetail');

  // Mock order data
  const order = {
    id,
    productName: 'Industrial LED Lights',
    supplierName: 'Shenzhen Lighting Co.',
    supplierCountry: 'CN',
    flag: '🇨🇳',
    stage: 5,
    value: 45000,
    depositPaid: true,
    inspectionResult: 'Passed',
    defectRate: 0.4,
    acidNumber: 'ACID-987654321',
    billOfLading: 'BL-CNEG-202611',
    containerNumber: 'MSKU1234567',
    shippingLine: 'Maersk',
    estimatedArrival: '2026-11-15 (Alexandria Port)'
  };

  return (
    <div className="container mx-auto p-4 space-y-6 bg-sea-mist min-h-screen font-body">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-display font-bold text-harbor-petrol">{order.id}</h1>
            <Badge className="bg-verified-green text-white hover:bg-verified-green/90">{t('active', { defaultMessage: 'Active' })}</Badge>
          </div>
          <p className="text-lg text-harbor-petrol font-medium"><bdi>{order.productName}</bdi></p>
          <div className="flex items-center gap-2 mt-2 text-steel">
            <span>{t('supplier', { defaultMessage: 'Supplier' })}: <bdi>{order.supplierName}</bdi></span>
            <span className="text-xl" role="img" aria-label="Country flag">{order.flag}</span>
            <VerificationBadge level={3} locale={locale as 'ar' | 'en'} />
          </div>
        </div>
        <div className="flex flex-col gap-2 min-w-[200px]">
          <Button variant="signal" className="w-full">
            {t('approveRelease', { defaultMessage: 'Approve Inspection & Release Balance' })}
          </Button>
          <Link href={`/${locale}/dashboard/disputes/new?order=${order.id}`} className="w-full">
            <Button variant="destructive" className="w-full">
              {t('raiseDispute', { defaultMessage: 'Raise a Dispute' })}
            </Button>
          </Link>
        </div>
      </div>

      {/* Interactive Deal Suite: Chat, PO, Escrow PDF, and FX Rate Lock */}
      <OrderInteractiveClient
        orderNumber={order.id}
        supplierName={order.supplierName}
        orderValueUsd={order.value}
        locale={locale}
      />

      {/* Progress tracking */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-harbor-petrol">{t('dealProgress', { defaultMessage: 'Deal Progress' })}</CardTitle>
        </CardHeader>
        <CardContent>
          <DealProgress currentStage={order.stage} locale={locale as 'ar' | 'en'} />
          
          <div className="mt-6 p-4 bg-sea-mist border-s-4 border-signal-yellow rounded-e-md">
            <h3 className="font-bold text-harbor-petrol mb-1">{t('currentStageTitle', { defaultMessage: 'Stage 5: Pre-shipment Inspection' })}</h3>
            <p className="text-steel text-sm">
              {t('currentStageDesc', { defaultMessage: 'The factory has completed production. An independent inspection agency has visited the facility and uploaded the final report. Please review the report below. Once approved, the balance payment held in escrow will be released and the goods will be shipped.' })}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financial Breakdown */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-harbor-petrol">{t('financialBreakdown', { defaultMessage: 'Financial Breakdown' })}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-steel">{t('totalValue', { defaultMessage: 'Total Order Value' })}</span>
              <span className="font-bold text-harbor-petrol text-lg" style={{ fontVariantNumeric: 'tabular-nums' }}>${order.value.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-steel">{t('deposit', { defaultMessage: '30% Deposit (Paid)' })}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-harbor-petrol" style={{ fontVariantNumeric: 'tabular-nums' }}>${(order.value * 0.3).toLocaleString()}</span>
                <span className="text-verified-green">✅</span>
              </div>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div className="flex flex-col">
                <span className="text-steel">{t('balance', { defaultMessage: '70% Balance' })}</span>
                <span className="text-xs text-steel/70 max-w-[200px]">{t('balanceDesc', { defaultMessage: 'Held in protected escrow, releases only after inspection approval' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-harbor-petrol" style={{ fontVariantNumeric: 'tabular-nums' }}>${(order.value * 0.7).toLocaleString()}</span>
                <span className="text-signal-yellow">⏳</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-steel text-sm">{t('fees', { defaultMessage: 'Platform commission & inspection fees included' })}</span>
            </div>
          </CardContent>
        </Card>

        {/* Inspection Report Section */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-harbor-petrol">{t('inspectionReport', { defaultMessage: 'Inspection Report' })}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-harbor-petrol">SGS Inspection Services</p>
                <p className="text-sm text-steel">Date: Oct 20, 2026</p>
              </div>
              <Badge className="bg-verified-green text-white">{t('passed', { defaultMessage: 'Passed ✅' })}</Badge>
            </div>
            
            <div>
              <p className="text-sm font-medium text-harbor-petrol mb-2">{t('photos', { defaultMessage: 'Inspection Gallery' })}</p>
              <div className="grid grid-cols-3 gap-2">
                {/* Mock photo boxes */}
                <div className="aspect-square bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">Photo 1</div>
                <div className="aspect-square bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">Photo 2</div>
                <div className="aspect-square bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">Photo 3</div>
              </div>
            </div>
            
            <div className="bg-sea-mist p-3 rounded-md">
              <span className="text-sm text-steel">{t('defectRate', { defaultMessage: 'Defect rate' })}: </span>
              <span className="font-medium text-harbor-petrol">{order.defectRate}% - {t('defectTolerance', { defaultMessage: 'within acceptable tolerance' })}</span>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Logistics & Egyptian Customs Tracking (Nafeza ACID) */}
        <div className="md:col-span-2">
          <CustomsTrackerCard
            orderNumber={order.id}
            initialAcidNumber={order.acidNumber}
            initialBlNumber={order.billOfLading}
            initialCarrier={order.shippingLine}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
}
