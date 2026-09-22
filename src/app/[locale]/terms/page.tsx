import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === 'ar';

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-[#0F4C5C] mb-2">
          {isAr ? 'الشروط والأحكام وسياسة الضمان' : 'Terms & Escrow Policy'}
        </h1>
        <p className="text-xs text-[#465A60]">
          {isAr ? 'آخر تحديث: سبتمبر 2026' : 'Last updated: September 2026'}
        </p>
      </div>

      <Card className="bg-white border-[#D2DDDB] p-6 space-y-6 text-sm text-[#465A60] leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-[#0F4C5C] mb-2">
            {isAr ? '1. مراحل الدفع وحماية الأموال (Staged Escrow)' : '1. Staged Payment & Escrow Protection'}
          </h2>
          <p>
            {isAr
              ? 'تتم جميع المعاملات المالية عبر الدفع على مراحل (30% مقدم لبدء التصنيع، و70% متبقي محتجز في الحساب الوسيط). لا يتم صرف المتبقي للمصنع إلا بعد اعتماد المشتري لتقرير فحص الجودة قبل الشحن.'
              : 'All transactions follow staged milestones (30% deposit to commence production, 70% balance held in escrow). Balance release is contingent on buyer approval of the pre-shipment inspection report.'}
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#0F4C5C] mb-2">
            {isAr ? '2. التوثيق المستقل للمصانع (Verification)' : '2. Independent Supplier Verification'}
          </h2>
          <p>
            {isAr
              ? 'شارات التوثيق على منصة مرسى مبنية على فحص وتدقيق مستقل للسجلات والمنشآت. لا تُباع شارات التوثيق أو ترتيب الظهور في البحث مقابل أي مبالغ مالية لضمان نزاهة المنصة.'
              : 'Verification badges are granted strictly following independent audit of documents and plants. Badges and search rankings are never sold to ensure total integrity.'}
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#0F4C5C] mb-2">
            {isAr ? '3. سياسة النزاعات والتحكيم (Dispute Arbitration)' : '3. Dispute Arbitration & Freeze'}
          </h2>
          <p>
            {isAr
              ? 'في حال تقديم طلب نزاع بخصوص مطابقة الجودة أو نقص الكميات، يتم تجميد صرف أي مستحقات للمصنع فوراً حتى فحص تقرير العينات وحل النزاع من خلال فريق التحكيم المعتمد في مرسى.'
              : 'Filing a dispute regarding product quality or quantity shortage immediately freezes balance payouts to the factory pending independent mediation by Marsa arbitration team.'}
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#0F4C5C] mb-2">
            {isAr ? '4. التقييمات الموثّقة فقط (Verified Reviews)' : '4. Authentic Reviews'}
          </h2>
          <p>
            {isAr
              ? 'يُسمح بنشر التقييمات فقط للمشترين الذين أتموا صفقات حقيقية مكتملة واستلموا البضاعة بنجاح عبر المنصة.'
              : 'Reviews can only be submitted by buyers who have completed verifiable deals on the platform.'}
          </p>
        </section>
      </Card>

      <div className="text-center pt-4">
        <Link
          href={`/${locale}`}
          className="text-xs font-bold text-[#0F4C5C] hover:underline"
        >
          {isAr ? '← العودة إلى الصفحة الرئيسية' : '← Back to Home'}
        </Link>
      </div>
    </div>
  );
}
