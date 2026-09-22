import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { CheckCircle, MapPin, Package, Calendar, ArrowRight } from 'lucide-react';

import { QuoteSubmissionDialog } from '@/components/features/quotes/quote-submission-dialog';
import { SupplierChatButton } from '@/components/features/supplier-portal/supplier-portal-chat-button';

export default async function SupplierPortalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('SupplierPortal');
  
  return (
    <div className="min-h-screen bg-sea-mist p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Supplier Profile Header */}
        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
              🏭
            </div>
            <div>
              <h1 className="text-2xl font-bold text-deep-tide flex items-center gap-2">
                Zhejiang Future Packaging Co.
                <span className="text-xl">🇨🇳</span>
              </h1>
              <p className="text-steel flex items-center gap-1 text-sm mt-1">
                <MapPin className="w-4 h-4" /> Yiwu, Zhejiang
              </p>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-verified-green/10 text-verified-green rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                {t('level2', { fallback: 'Level 2: Video-verified' })}
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Link 
              href={`/${locale}/supplier-portal/verification`}
              className="inline-flex items-center gap-2 bg-signal-yellow text-deep-tide px-4 py-2 rounded-lg font-medium hover:bg-signal-yellow/90 transition-colors"
            >
              {t('upgradeLevel3', { fallback: 'Upgrade to Level 3 (On-site Audit)' })}
            </Link>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Matching Buy Requests (RFQs) Feed */}
          <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-deep-tide mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-harbor-petrol" />
              {t('rfqs', { fallback: 'Matching Buy Requests' })}
            </h2>
            <div className="space-y-4">
              {[
                { id: 1, title: 'Custom Corrugated Cartons - 5-ply', qty: '10,000', cat: 'Packaging', dest: 'Cairo, Egypt 🇪🇬' },
                { id: 2, title: 'Industrial LED High Bay 150W', qty: '2,500', cat: 'Lighting', dest: 'Alexandria, Egypt 🇪🇬' },
                { id: 3, title: 'Stainless Steel Fasteners & Bolts M8', qty: '50,000', cat: 'Spare Parts', dest: 'Suez, Egypt 🇪🇬' },
              ].map((rfq) => (
                <div key={rfq.id} className="border border-gray-100 rounded-lg p-4 hover:border-harbor-petrol/30 transition-colors bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-deep-tide">{rfq.title}</h3>
                    <span className="bg-gray-100 text-steel text-xs px-2 py-1 rounded">{rfq.dest}</span>
                  </div>
                  <div className="text-sm text-steel space-y-1 mb-4">
                    <p><bdi>{rfq.qty}</bdi> units • Target Date: Oct 15, 2026</p>
                    <p>Category: {rfq.cat} • Required: Sample Inspection</p>
                  </div>
                  <QuoteSubmissionDialog
                    rfqTitle={rfq.title}
                    rfqQuantity={rfq.qty}
                    destination={rfq.dest}
                    locale={locale}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Active Orders Section */}
          <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-deep-tide mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-harbor-petrol" />
              {t('activeOrders', { fallback: 'Active Orders' })}
            </h2>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-deep-tide">#ORD-00{80+i} - LED Panels 60x60</h3>
                    <span className="bg-signal-yellow/20 text-deep-tide text-xs px-2 py-1 rounded font-medium">
                      Manufacturing
                    </span>
                  </div>
                  <div className="text-sm text-steel space-y-1 mb-4">
                    <p className="text-verified-green flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> 30% Deposit Confirmed
                    </p>
                    <p>Next Step: Awaiting Inspector (Oct 10, 2026)</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <SupplierChatButton
                      orderNumber={`ORD-00${80+i}`}
                      buyerName="Ahmed Hassan (Cairo Importer)"
                      locale={locale}
                    />
                    <Link href={`/${locale}/dashboard/orders/ORD-0042`} className="text-harbor-petrol text-sm font-medium flex items-center gap-1 hover:underline w-fit">
                      View Details <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
