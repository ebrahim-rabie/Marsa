import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === 'ar';

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-10">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#0F4C5C] mb-3">
          {isAr ? 'عن منصة مرسى (Marsa)' : 'About Marsa'}
        </h1>
        <p className="text-[#465A60] max-w-xl mx-auto text-base">
          {isAr
            ? 'سوق توريد مُدار يربط المستوردين والتجار في مصر بمصانع موثّقة في مصر والصين'
            : 'A managed sourcing marketplace connecting Egyptian buyers with verified factories in Egypt and China'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-[#D2DDDB] p-6 text-center">
          <div className="text-3xl mb-3">🔍</div>
          <h3 className="font-bold text-[#0F4C5C] text-lg mb-2">
            {isAr ? 'توثيق حقيقي' : 'Verified Factories'}
          </h3>
          <p className="text-xs text-[#465A60] leading-relaxed">
            {isAr
              ? 'ندقق في السجل التجاري والبطاقة الضريبية ونقوم بجولات فحص مصورة داخل المصانع.'
              : 'Independent verification of licenses, tax cards, and virtual factory walkthroughs.'}
          </p>
        </Card>

        <Card className="bg-white border-[#D2DDDB] p-6 text-center">
          <div className="text-3xl mb-3">⚖️</div>
          <h3 className="font-bold text-[#0F4C5C] text-lg mb-2">
            {isAr ? 'مقارنة عادلة' : 'Fair Comparison'}
          </h3>
          <p className="text-xs text-[#465A60] leading-relaxed">
            {isAr
              ? 'مقارنة عروض المصانع المصرية والصينية شاملاً الشحن والجمارك لاختيار الأنسب.'
              : 'Normalized quotes side-by-side with landed costs and local alternatives.'}
          </p>
        </Card>

        <Card className="bg-white border-[#D2DDDB] p-6 text-center">
          <div className="text-3xl mb-3">🛡️</div>
          <h3 className="font-bold text-[#0F4C5C] text-lg mb-2">
            {isAr ? 'حماية الدفع والفحص' : 'Protected Escrow'}
          </h3>
          <p className="text-xs text-[#465A60] leading-relaxed">
            {isAr
              ? 'المتبقي من قيمة الصفقة لا يُصرف للمصنع إلا بعد تقرير فحص الجودة المعتمد.'
              : '70% balance held in protected escrow until pre-shipment inspection is approved.'}
          </p>
        </Card>
      </div>

      <Card className="bg-[#0F4C5C] text-white p-8 rounded-2xl text-center">
        <h2 className="text-2xl font-bold font-display mb-3">
          {isAr ? 'جاهز لتوريد بضاعتك القادمة بأمان؟' : 'Ready to safely source your next shipment?'}
        </h2>
        <p className="text-white/80 text-sm max-w-lg mx-auto mb-6">
          {isAr
            ? 'أرسل طلب الشراء وسيقوم فريق العمل بتوفير عروض أسعار موثّقة خلال 24 ساعة.'
            : 'Submit your RFQ and our sourcing team will curate verified quotes within 24 hours.'}
        </p>
        <Link href={`/${locale}/request/new`}>
          <Button variant="signal" size="lg" className="font-bold">
            {isAr ? 'ابعت طلب شراء الآن' : 'Send Buy Request Now'}
          </Button>
        </Link>
      </Card>
    </div>
  );
}
