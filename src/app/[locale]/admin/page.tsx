import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DealProgress } from '@/components/ui/deal-progress';
import Link from 'next/link';

import { ResolveDisputeDialog } from '@/components/features/disputes/resolve-dispute-dialog';

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('AdminDashboard');

  return (
    <div className="container mx-auto p-4 space-y-6 bg-sea-mist min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-harbor-petrol">{t('title', { defaultMessage: 'Admin Dashboard' })}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-steel">{t('totalGmv', { defaultMessage: 'Total GMV' })}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-harbor-petrol" style={{ fontVariantNumeric: 'tabular-nums' }}>$1,250,000</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-steel">{t('activeDeals', { defaultMessage: 'Active Deals' })}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-harbor-petrol" style={{ fontVariantNumeric: 'tabular-nums' }}>42</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-steel">{t('sourcingPipeline', { defaultMessage: 'Sourcing Pipeline' })}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-harbor-petrol" style={{ fontVariantNumeric: 'tabular-nums' }}>18</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-steel">{t('preShipmentInspections', { defaultMessage: 'Pre-shipment Inspections' })}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-harbor-petrol" style={{ fontVariantNumeric: 'tabular-nums' }}>7</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-steel">{t('totalCommission', { defaultMessage: 'Total Commission Earned' })}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-harbor-petrol" style={{ fontVariantNumeric: 'tabular-nums' }}>$62,500</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-harbor-petrol">{t('dealPipeline', { defaultMessage: 'Deal Pipeline' })}</h2>
        <Card className="bg-white shadow-sm p-4">
          <div className="grid grid-cols-7 gap-2 text-center text-sm text-steel mb-2">
            <div>1. Buy Request</div>
            <div>2. Sourcing Quotes</div>
            <div>3. Sample & Checks</div>
            <div>4. Contract Signed</div>
            <div>5. Pre-shipment</div>
            <div>6. Freight & Customs</div>
            <div>7. Review</div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {/* Visual representation of counts per stage */}
            <div className="h-2 rounded bg-signal-yellow" style={{ opacity: 0.8 }} />
            <div className="h-2 rounded bg-signal-yellow" style={{ opacity: 0.9 }} />
            <div className="h-2 rounded bg-signal-yellow" style={{ opacity: 0.6 }} />
            <div className="h-2 rounded bg-signal-yellow" style={{ opacity: 0.7 }} />
            <div className="h-2 rounded bg-signal-yellow" style={{ opacity: 0.4 }} />
            <div className="h-2 rounded bg-signal-yellow" style={{ opacity: 0.5 }} />
            <div className="h-2 rounded bg-signal-yellow" style={{ opacity: 0.3 }} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-harbor-petrol">{t('activeOrders', { defaultMessage: 'Active Orders' })}</h2>
          <Card className="bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('order', { defaultMessage: 'Order' })}</TableHead>
                  <TableHead>{t('product', { defaultMessage: 'Product' })}</TableHead>
                  <TableHead>{t('buyer', { defaultMessage: 'Buyer' })}</TableHead>
                  <TableHead>{t('supplier', { defaultMessage: 'Supplier' })}</TableHead>
                  <TableHead>{t('stage', { defaultMessage: 'Stage' })}</TableHead>
                  <TableHead className="text-end">{t('value', { defaultMessage: 'Value' })}</TableHead>
                  <TableHead className="text-end">{t('action', { defaultMessage: 'Action' })}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">ORD-0042</TableCell>
                  <TableCell>Industrial LED Lights</TableCell>
                  <TableCell>Cairo Tech Solutions</TableCell>
                  <TableCell>Shenzhen Lighting Co. 🇨🇳</TableCell>
                  <TableCell><Badge variant="outline" className="bg-sea-mist text-harbor-petrol border-harbor-petrol">5. Pre-shipment</Badge></TableCell>
                  <TableCell className="text-end" style={{ fontVariantNumeric: 'tabular-nums' }}>$45,000</TableCell>
                  <TableCell className="text-end">
                    <Link href={`/${locale}/dashboard/orders/ORD-0042`}>
                      <Button size="sm" variant="primary">
                        {t('view', { defaultMessage: 'View' })}
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">ORD-0043</TableCell>
                  <TableCell>Textile Machinery Parts</TableCell>
                  <TableCell>Alex Textiles</TableCell>
                  <TableCell>Mahmoudiyah Metals 🇪🇬</TableCell>
                  <TableCell><Badge variant="outline" className="bg-sea-mist text-harbor-petrol border-harbor-petrol">2. Sourcing Quotes</Badge></TableCell>
                  <TableCell className="text-end" style={{ fontVariantNumeric: 'tabular-nums' }}>$12,500</TableCell>
                  <TableCell className="text-end">
                    <Link href={`/${locale}/dashboard/orders/ORD-0043`}>
                      <Button size="sm" variant="primary">
                        {t('view', { defaultMessage: 'View' })}
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-alert-red">{t('recentDisputes', { defaultMessage: 'Recent Disputes' })}</h2>
          <Card className="bg-white shadow-sm">
            <div className="divide-y divide-gray-100">
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-harbor-petrol">ORD-0038</div>
                    <div className="text-sm text-steel">Quality mismatch</div>
                  </div>
                  <Badge className="bg-alert-red text-white hover:bg-alert-red/90">{t('urgent', { defaultMessage: 'Urgent' })}</Badge>
                </div>
                <ResolveDisputeDialog
                  orderId="ORD-0038"
                  reason="Quality mismatch"
                  isUrgent={true}
                  locale={locale}
                />
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-harbor-petrol">ORD-0040</div>
                    <div className="text-sm text-steel">Production delay</div>
                  </div>
                  <Badge className="bg-signal-yellow text-harbor-petrol hover:bg-signal-yellow/90">{t('pending', { defaultMessage: 'Pending' })}</Badge>
                </div>
                <ResolveDisputeDialog
                  orderId="ORD-0040"
                  reason="Production delay"
                  isUrgent={false}
                  locale={locale}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
