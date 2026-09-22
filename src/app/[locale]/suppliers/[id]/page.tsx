import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ShieldCheck, MapPin, MessageCircle, Quote } from 'lucide-react';
import Link from 'next/link';
import { ReviewDialog } from '@/components/features/reviews/review-dialog';

export default async function SupplierProfilePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('SupplierProfile');

  return (
    <div className="min-h-screen bg-sea-mist p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Supplier Header */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="h-32 bg-harbor-petrol/10"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end -mt-12 mb-6">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 bg-white rounded-xl border-4 border-white shadow-sm flex items-center justify-center text-4xl">
                  🏭
                </div>
                <div className="mb-2">
                  <h1 className="text-3xl font-bold text-deep-tide mb-1">Zhejiang Future Packaging Co.</h1>
                  <p className="text-steel flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> Yiwu, Zhejiang, China 🇨🇳
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex gap-3">
                <a 
                  href={`https://wa.me/201000000000?text=${encodeURIComponent(`مرحباً، أود الاستفسار عن التوريد من مصنع Zhejiang Future Packaging Co. (${id})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border border-harbor-petrol text-harbor-petrol px-4 py-2 rounded-lg font-medium hover:bg-harbor-petrol/5 transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> {t('chat', { defaultMessage: 'Chat' })}
                </a>
                <Link 
                  href={`/${locale}/request/new`}
                  className="bg-harbor-petrol text-white px-4 py-2 rounded-lg font-medium hover:bg-harbor-petrol/90 transition-colors flex items-center gap-2"
                >
                  <Quote className="w-4 h-4" /> {t('requestQuote', { defaultMessage: 'Request Quote' })}
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-gray-100">
              <div>
                <p className="text-sm text-steel mb-1">Verification</p>
                <div className="flex items-center gap-1 text-verified-green font-medium">
                  <ShieldCheck className="w-5 h-5" /> Audited (Aug 2026)
                </div>
              </div>
              <div>
                <p className="text-sm text-steel mb-1">Main Categories</p>
                <p className="font-medium text-deep-tide">Paper Packaging, Plastics</p>
              </div>
              <div>
                <p className="text-sm text-steel mb-1">Min. Order (MOQ)</p>
                <p className="font-medium text-deep-tide"><bdi>5,000</bdi> pieces</p>
              </div>
              <div>
                <p className="text-sm text-steel mb-1">Capacity</p>
                <p className="font-medium text-deep-tide">500,000 pcs / month</p>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-deep-tide mb-2">{t('verifiedReviews', { defaultMessage: 'Verified Reviews' })}</h2>
              <p className="text-steel text-sm">{t('reviewsNotice', { defaultMessage: 'ONLY buyers who completed real orders on Marsa can review.' })}</p>
            </div>
            <div className="flex items-center gap-4">
              <ReviewDialog orderId="ORD-0042" factoryName="Zhejiang Future Packaging Co." />
              <div className="text-end">
                <div className="text-4xl font-bold text-deep-tide mb-1">4.9<span className="text-2xl text-gray-400">/5</span></div>
                <div className="flex justify-end text-signal-yellow text-xl" dir="ltr">★★★★★</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8 p-6 bg-gray-50 rounded-xl">
            {[
              { label: 'Quality', score: 4.9 },
              { label: 'Communication', score: 4.8 },
              { label: 'Delivery', score: 5.0 },
              { label: 'Landed Value', score: 4.9 },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-sm text-steel mb-1">{stat.label}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-signal-yellow rounded-full" style={{ width: `${(stat.score / 5) * 100}%` }}></div>
                  </div>
                  <span className="font-medium text-deep-tide text-sm">{stat.score}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {/* Review Card */}
            <div className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-deep-tide">Cairo Trading Co.</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex text-signal-yellow text-sm" dir="ltr">★★★★★</div>
                    <span className="text-xs text-steel">Sept 10, 2026</span>
                  </div>
                </div>
                <div className="bg-verified-green/10 text-verified-green px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-verified-green/20">
                  <ShieldCheck className="w-4 h-4" /> صفقة موثّقة #ORD-0028
                </div>
              </div>
              <p className="text-deep-tide" dir="auto">
                <bdi>ممتاز جداً! جودة الكراتين مطابقة تماماً للعينة اللي استلمناها. تواصل المصنع كان سريع وواضح طول فترة التصنيع.</bdi>
              </p>
              <p className="text-steel text-sm mt-2" dir="auto">
                <bdi>Excellent! The quality of the cartons matched the sample exactly. Factory communication was fast and clear throughout manufacturing.</bdi>
              </p>
            </div>
            
             <div className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-deep-tide">Alexandria Electronics</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex text-signal-yellow text-sm" dir="ltr">★★★★☆</div>
                    <span className="text-xs text-steel">Aug 22, 2026</span>
                  </div>
                </div>
                <div className="bg-verified-green/10 text-verified-green px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-verified-green/20">
                  <ShieldCheck className="w-4 h-4" /> صفقة موثّقة #ORD-0015
                </div>
              </div>
              <p className="text-deep-tide" dir="auto">
                <bdi>Delivery was slightly delayed by 2 days, but the overall landed value and product quality are exceptional. Highly recommended for long-term supply.</bdi>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
