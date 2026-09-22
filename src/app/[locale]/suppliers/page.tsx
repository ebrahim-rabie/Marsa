import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { VerificationBadge } from '@/components/ui/verification-badge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SupplierItem {
  id: string;
  name: string;
  nameAr: string;
  country: 'EG' | 'CN';
  city: string;
  cityAr: string;
  verificationLevel: 1 | 2 | 3;
  categories: string[];
  categoriesAr: string[];
  totalDeals: number;
  rating: number;
  minOrder: string;
  leadTime: string;
  leadTimeAr: string;
  isMiddleman: boolean;
}

const SAMPLE_SUPPLIERS: SupplierItem[] = [
  {
    id: 'sup-1',
    name: 'Guangzhou Opto-Electronics Co.',
    nameAr: 'شركة قوانغتشو للإلكترونيات الضوئية',
    country: 'CN',
    city: 'Guangzhou',
    cityAr: 'قوانغتشو',
    verificationLevel: 3,
    categories: ['lighting', 'electrical'],
    categoriesAr: ['إضاءة LED', 'مستلزمات كهربائية'],
    totalDeals: 28,
    rating: 4.9,
    minOrder: '$3,000',
    leadTime: '20-25 days',
    leadTimeAr: '20-25 يوم',
    isMiddleman: false,
  },
  {
    id: 'sup-2',
    name: 'El-Delta Modern Packaging Factory',
    nameAr: 'مصنع الدلتا للتعبئة والتغليف الحديث',
    country: 'EG',
    city: '10th of Ramadan City',
    cityAr: 'العاشر من رمضان',
    verificationLevel: 2,
    categories: ['packaging'],
    categoriesAr: ['كرتون مضلع', 'طباعة وتغليف'],
    totalDeals: 19,
    rating: 4.8,
    minOrder: 'EGP 35,000',
    leadTime: '7-10 days',
    leadTimeAr: '7-10 أيام',
    isMiddleman: false,
  },
  {
    id: 'sup-3',
    name: 'Zhejiang Precision Tooling Ltd.',
    nameAr: 'مصنع تشجيانغ للأدوات وقطع الغيار',
    country: 'CN',
    city: 'Ningbo',
    cityAr: 'نينغبو',
    verificationLevel: 3,
    categories: ['spare_parts'],
    categoriesAr: ['قطع غيار ماكينات', 'قوالب صناعية'],
    totalDeals: 34,
    rating: 4.9,
    minOrder: '$5,000',
    leadTime: '25-30 days',
    leadTimeAr: '25-30 يوم',
    isMiddleman: false,
  },
  {
    id: 'sup-4',
    name: 'Misr Textiles & Fabrics Group',
    nameAr: 'مجموعة مصر للغزل والمنسوجات',
    country: 'EG',
    city: 'El-Mahalla El-Kubra',
    cityAr: 'المحلة الكبرى',
    verificationLevel: 2,
    categories: ['textiles'],
    categoriesAr: ['أقمشة صناعية', 'غزول قطنية'],
    totalDeals: 15,
    rating: 4.7,
    minOrder: 'EGP 50,000',
    leadTime: '10-15 days',
    leadTimeAr: '10-15 يوم',
    isMiddleman: false,
  },
  {
    id: 'sup-5',
    name: 'Yiwu Smart Trade Services',
    nameAr: 'مؤسسة إيو للتوريد والتجارة',
    country: 'CN',
    city: 'Yiwu',
    cityAr: 'إيو',
    verificationLevel: 1,
    categories: ['packaging', 'spare_parts'],
    categoriesAr: ['إكسسوارات', 'أدوات خفيفة'],
    totalDeals: 8,
    rating: 4.5,
    minOrder: '$2,000',
    leadTime: '15-20 days',
    leadTimeAr: '15-20 يوم',
    isMiddleman: true,
  },
];

export default async function SuppliersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === 'ar';

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#0F4C5C] mb-3">
          {isAr ? 'دليل المصانع والموردين الموثّقين' : 'Verified Suppliers Directory'}
        </h1>
        <p className="text-[#465A60] text-base">
          {isAr
            ? 'تصفح المصانع المصرية والصينية المعتمدة. كل مورد خضع لتدقيق مستقل ولا تُباع شارات التوثيق أبداً.'
            : 'Browse verified Egyptian and Chinese factories. Every supplier undergoes independent audit, and badges are never for sale.'}
        </p>
      </div>

      {/* Trust Guarantee Callout */}
      <div className="bg-[#E3EEED] border-s-4 border-[#0F4C5C] p-4 rounded-lg mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-[#0F4C5C] text-sm">
            {isAr ? 'قاعدة ثقة ثابتة في مرسى:' : 'Marsa Fixed Trust Rule:'}
          </h2>
          <p className="text-xs text-[#465A60] mt-0.5">
            {isAr
              ? 'التقييمات مبنية فقط على صفقات حقيقية اكتملت عبر المنصة. الترتيب في البحث لا يُباع بالمال.'
              : 'Ratings are strictly built from completed on-platform deals. Ranking is never monetized.'}
          </p>
        </div>
        <Link
          href={`/${locale}/request/new`}
          className="shrink-0 bg-[#0F4C5C] hover:bg-[#0A2F38] text-white text-xs font-bold py-2.5 px-4 rounded-md transition-colors"
        >
          {isAr ? 'طلب عرض سعر مخصص' : 'Custom RFQ'}
        </Link>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_SUPPLIERS.map((sup) => (
          <Card key={sup.id} className="flex flex-col hover:border-[#0F4C5C] transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-lg">
                      {sup.country === 'EG' ? '🇪🇬' : '🇨🇳'}
                    </span>
                    <span className="text-xs font-semibold text-[#465A60]">
                      {isAr ? sup.cityAr : sup.city}
                    </span>
                    {sup.isMiddleman && (
                      <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                        {isAr ? 'وسيط معلن' : 'Broker'}
                      </span>
                    )}
                  </div>
                  <Link href={`/${locale}/suppliers/${sup.id}`} className="hover:underline">
                    <CardTitle className="text-lg font-bold text-[#0F4C5C] font-display">
                      {isAr ? sup.nameAr : sup.name}
                    </CardTitle>
                  </Link>
                </div>
                <VerificationBadge level={sup.verificationLevel} locale={locale as 'ar' | 'en'} />
              </div>
              <CardDescription className="flex flex-wrap gap-1.5 mt-2">
                {(isAr ? sup.categoriesAr : sup.categories).map((cat, idx) => (
                  <Badge key={idx} variant="default" className="text-[11px] py-0 px-2 bg-gray-50">
                    {cat}
                  </Badge>
                ))}
              </CardDescription>
            </CardHeader>

            <CardContent className="mt-auto pt-3 border-t border-[#D2DDDB] text-xs text-[#465A60]">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <span className="block text-[11px] text-gray-500">
                    {isAr ? 'أقل قيمة طلب (MOQ)' : 'Min Order'}
                  </span>
                  <span className="font-semibold text-[#0A2F38] font-mono">
                    {sup.minOrder}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-gray-500">
                    {isAr ? 'مدة التصنيع' : 'Lead Time'}
                  </span>
                  <span className="font-semibold text-[#0A2F38]">
                    {isAr ? sup.leadTimeAr : sup.leadTime}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-gray-500">
                    {isAr ? 'الصفقات المكتملة' : 'Deals Done'}
                  </span>
                  <span className="font-semibold text-[#1B7A50] font-mono">
                    {sup.totalDeals} {isAr ? 'صفقة' : 'deals'}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-gray-500">
                    {isAr ? 'التقييم' : 'Rating'}
                  </span>
                  <span className="font-semibold text-[#0A2F38] font-mono">
                    ⭐ {sup.rating} / 5.0
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={`/${locale}/suppliers/${sup.id}`}
                  className="inline-flex items-center justify-center bg-[#E3EEED] hover:bg-[#D2DDDB] text-[#0F4C5C] font-bold py-2 px-2 rounded-lg text-xs transition-colors"
                >
                  {isAr ? 'الملف والتقييمات' : 'Profile'}
                </Link>
                <Link
                  href={`/${locale}/request/new?supplier=${sup.id}`}
                  className="inline-flex items-center justify-center bg-[#F2B01E] hover:bg-yellow-500 text-[#2E2200] font-bold py-2 px-2 rounded-lg text-xs transition-colors"
                >
                  {isAr ? 'طلب عرض سعر' : 'Get Quote'}
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
