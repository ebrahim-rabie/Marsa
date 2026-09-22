import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { DealProgress } from '@/components/ui/deal-progress';
import { VerificationBadge } from '@/components/ui/verification-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === 'ar';

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Welcome & Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D2DDDB] pb-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-[#0F4C5C]">
            {isAr ? 'لوحة تحكم المشتري' : 'Buyer Dashboard'}
          </h1>
          <p className="text-sm text-[#465A60] mt-1">
            {isAr
              ? 'متابعة طلبات الشراء، مقارنة العروض، وإدارة مراحل الصفقات النشطة'
              : 'Track buy requests, compare quotes, and monitor active deal stages'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/${locale}/request/new`}>
            <Button variant="signal" size="md">
              {isAr ? '+ طلب شراء جديد' : '+ New Buy Request'}
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-[#465A60]">
              {isAr ? 'الطلبات النشطة' : 'Active Requests'}
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-[#0F4C5C] font-mono">
              3
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-[#465A60]">
              {isAr ? 'عروض الأسعار الجاهزة للمراجعة' : 'Quotes Ready for Review'}
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-[#F2B01E] font-mono">
              4
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-[#465A60]">
              {isAr ? 'صفقات قيد التنفيذ والشحن' : 'In-Progress Orders'}
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-[#1B7A50] font-mono">
              1
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-[#465A60]">
              {isAr ? 'إجمالي الصفقات المكتملة' : 'Completed Deals'}
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-[#465A60] font-mono">
              2
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Section 1: Active Order with Deal Progress Tracker */}
      <Card className="bg-white border-[#0F4C5C]/20 shadow-sm overflow-hidden">
        <CardHeader className="bg-[#E3EEED]/50 border-b border-[#D2DDDB] py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Link href={`/${locale}/dashboard/orders/ORD-0042`} className="hover:underline">
                  <span className="font-mono font-bold text-xs bg-[#0F4C5C] text-white px-2 py-0.5 rounded">
                    ORD-0042
                  </span>
                </Link>
                <Link href={`/${locale}/dashboard/orders/ORD-0042`} className="hover:underline">
                  <CardTitle className="text-lg font-bold text-[#0F4C5C]">
                    {isAr ? 'ألواح إضاءة LED سقفية 60x60 (5,000 وحدة)' : '60x60 LED Ceiling Panels (5,000 units)'}
                  </CardTitle>
                </Link>
              </div>
              <p className="text-xs text-[#465A60] mt-1">
                {isAr ? 'المورد: مصنع قوانغتشو للإلكترونيات 🇨🇳 • إجمالي الصفقة: $7,200' : 'Supplier: Guangzhou Opto 🇨🇳 • Total Deal: $7,200'}
              </p>
            </div>
            <Link href={`/${locale}/dashboard/orders/ORD-0042`}>
              <Badge variant="warning" className="cursor-pointer hover:opacity-90">
                {isAr ? 'المرحلة 5: فحص قبل الشحن ←' : 'Stage 5: Pre-shipment Inspection ←'}
              </Badge>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-6 pb-6">
          <div className="mb-4">
            <h4 className="text-xs font-bold text-[#465A60] uppercase mb-4 tracking-wider">
              {isAr ? 'خط سير الصفقة (من الطلب إلى الاستلام)' : 'Deal Timeline Progress'}
            </h4>
            <DealProgress currentStage={5} locale={locale as 'ar' | 'en'} />
          </div>

          <div className="bg-[#F3F7F6] p-4 rounded-xl border border-[#D2DDDB] mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h5 className="font-bold text-sm text-[#0F4C5C]">
                {isAr ? 'الخطوة الحالية: فحص الجودة في المصنع' : 'Current Step: Factory Quality Inspection'}
              </h5>
              <p className="text-xs text-[#465A60] mt-1">
                {isAr
                  ? 'تم تعيين مكتب فحص معتمد في الصين. موعد زيارة خط الإنتاج يوم الثلاثاء القادم. لن يُصرف متبقي المبلغ للمصنع إلا بعد موافقتك على تقرير الفحص المصور.'
                  : 'Certified inspection partner assigned in China. Plant visit on Tuesday. Balance funds remain protected until you review and approve photo inspection report.'}
              </p>
            </div>
            <Link href={`/${locale}/dashboard/orders/ORD-0042`} className="shrink-0">
              <Button variant="signal" size="sm">
                {isAr ? 'عرض تقرير الفحص الكامل' : 'View Full Report'}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: THE CORE MARSA FEATURE — Side-by-Side Quote Comparison */}
      <Card className="bg-white border-[#D2DDDB] shadow-sm">
        <CardHeader className="border-b border-[#D2DDDB] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs bg-[#F2B01E] text-[#2E2200] px-2 py-0.5 rounded">
                  RFQ-0089
                </span>
                <CardTitle className="text-lg font-bold text-[#0F4C5C]">
                  {isAr ? 'مقارنة عروض الأسعار: عبوات كرتون مضلع 3 طبقات (10,000 كرتونة)' : 'Quotes Comparison: 3-Layer Corrugated Cartons (10,000 units)'}
                </CardTitle>
              </div>
              <p className="text-xs text-[#465A60] mt-1">
                {isAr
                  ? 'عروض موثّقة ومحسوبة بنفس الشروط شاملاً الشحن والجمارك التقديرية للمفاضلة العادلة بين المحلي والمستورد'
                  : 'Normalized quotes side-by-side including estimated freight & customs for fair local vs. import comparison'}
              </p>
            </div>
            <span className="text-xs text-[#1B7A50] font-bold bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
              {isAr ? 'جاهز للمفاضلة والاختيار' : 'Ready for Selection'}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#E3EEED]">
                <TableHead className="font-bold text-[#0F4C5C]">
                  {isAr ? 'بند المقارنة' : 'Comparison Item'}
                </TableHead>
                <TableHead className="font-bold text-[#0F4C5C] text-center border-s border-[#D2DDDB]">
                  <div className="flex items-center justify-center gap-1.5">
                    <span>🇨🇳</span>
                    <span>{isAr ? 'مصنع تشجيانغ للكرتون' : 'Zhejiang Pack Co.'}</span>
                  </div>
                  <div className="mt-1">
                    <VerificationBadge level={3} locale={locale as 'ar' | 'en'} />
                  </div>
                </TableHead>
                <TableHead className="font-bold text-[#0F4C5C] text-center border-s border-[#D2DDDB]">
                  <div className="flex items-center justify-center gap-1.5">
                    <span>🇪🇬</span>
                    <span>{isAr ? 'مصنع العاشر للكرتون' : '10th of Ramadan Pack'}</span>
                  </div>
                  <div className="mt-1">
                    <VerificationBadge level={2} locale={locale as 'ar' | 'en'} />
                  </div>
                </TableHead>
                <TableHead className="font-bold text-[#0F4C5C] text-center border-s border-[#D2DDDB]">
                  <div className="flex items-center justify-center gap-1.5">
                    <span>🇨🇳</span>
                    <span>{isAr ? 'مصنع نينغبو للطباعة' : 'Ningbo Print Ltd.'}</span>
                  </div>
                  <div className="mt-1">
                    <VerificationBadge level={2} locale={locale as 'ar' | 'en'} />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-[#465A60]">
                  {isAr ? 'بلد المنشأ' : 'Country'}
                </TableCell>
                <TableCell className="text-center border-s border-[#D2DDDB]">
                  {isAr ? 'الصين (نينغبو)' : 'China (Ningbo)'}
                </TableCell>
                <TableCell className="text-center border-s border-[#D2DDDB] bg-green-50/40 font-semibold text-[#1B7A50]">
                  {isAr ? 'مصر (العاشر من رمضان)' : 'Egypt (10th Ramadan)'}
                </TableCell>
                <TableCell className="text-center border-s border-[#D2DDDB]">
                  {isAr ? 'الصين (قوانغتشو)' : 'China (Guangzhou)'}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium text-[#465A60]">
                  {isAr ? 'سعر الوحدة من المصنع' : 'Unit Price (EXW/FOB)'}
                </TableCell>
                <TableCell className="text-center border-s border-[#D2DDDB] font-mono font-bold text-[#0A2F38]">
                  $0.42
                </TableCell>
                <TableCell className="text-center border-s border-[#D2DDDB] font-mono font-bold text-[#0A2F38]">
                  EGP 24.50
                </TableCell>
                <TableCell className="text-center border-s border-[#D2DDDB] font-mono font-bold text-[#0A2F38]">
                  $0.45
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium text-[#465A60]">
                  {isAr ? 'أقل كمية طلب (MOQ)' : 'Minimum Order (MOQ)'}
                </TableCell>
                <TableCell className="text-center border-s border-[#D2DDDB] font-mono">
                  10,000
                </TableCell>
                <TableCell className="text-center border-s border-[#D2DDDB] font-mono font-semibold text-[#1B7A50]">
                  5,000
                </TableCell>
                <TableCell className="text-center border-s border-[#D2DDDB] font-mono">
                  10,000
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium text-[#465A60]">
                  {isAr ? 'مدة التصنيع والتسليم' : 'Lead Time'}
                </TableCell>
                <TableCell className="text-center border-s border-[#D2DDDB]">
                  {isAr ? '30 يوم (شحن بحري)' : '30 days (Ocean)'}
                </TableCell>
                <TableCell className="text-center border-s border-[#D2DDDB] font-bold text-[#1B7A50]">
                  {isAr ? '7 أيام (تسليم فوري)' : '7 days (Fast local)'}
                </TableCell>
                <TableCell className="text-center border-s border-[#D2DDDB]">
                  {isAr ? '35 يوم (شحن بحري)' : '35 days (Ocean)'}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium text-[#465A60]">
                  {isAr ? 'الشحن والتخليص التقديري' : 'Estimated Freight & Customs'}
                </TableCell>
                <TableCell className="text-center border-s border-[#D2DDDB] font-mono text-xs">
                  +$750 (شحن) + $350 (جمارك)
                </TableCell>
                <TableCell className="text-center border-s border-[#D2DDDB] font-mono text-xs text-[#1B7A50] font-bold">
                  {isAr ? 'شحن محلي: 1,200 ج.م فقط' : 'Local freight: EGP 1,200'}
                </TableCell>
                <TableCell className="text-center border-s border-[#D2DDDB] font-mono text-xs">
                  +$800 (شحن) + $380 (جمارك)
                </TableCell>
              </TableRow>

              <TableRow className="bg-[#F3F7F6] font-bold">
                <TableCell className="text-[#0F4C5C]">
                  {isAr ? 'التكلفة الإجمالية الواصلة للمخزن' : 'Estimated Landed Total'}
                </TableCell>
                <TableCell className="text-center border-s border-[#D2DDDB] font-mono text-base text-[#0F4C5C]">
                  $5,300 (~265,000 ج.م)
                </TableCell>
                <TableCell className="text-center border-s border-[#D2DDDB] font-mono text-base text-[#1B7A50]">
                  246,200 ج.م
                </TableCell>
                <TableCell className="text-center border-s border-[#D2DDDB] font-mono text-base text-[#0F4C5C]">
                  $5,680 (~284,000 ج.م)
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium text-[#465A60]">
                  {isAr ? 'الإجراء المطلوب' : 'Action'}
                </TableCell>
                <TableCell className="text-center border-s border-[#D2DDDB] p-3">
                  <Button variant="secondary" size="sm" className="w-full text-xs">
                    {isAr ? 'طلب عينة فحص' : 'Order Sample'}
                  </Button>
                </TableCell>
                <TableCell className="text-center border-s border-[#D2DDDB] p-3">
                  <Link href={`/${locale}/dashboard/orders/ORD-0042`} className="block w-full">
                    <Button variant="signal" size="sm" className="w-full text-xs font-bold shadow-sm">
                      {isAr ? 'اعتماد العرض والتعاقد' : 'Accept & Contract'}
                    </Button>
                  </Link>
                </TableCell>
                <TableCell className="text-center border-s border-[#D2DDDB] p-3">
                  <Button variant="secondary" size="sm" className="w-full text-xs">
                    {isAr ? 'طلب عينة فحص' : 'Order Sample'}
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
