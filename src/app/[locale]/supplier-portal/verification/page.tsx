import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FileText, Video, ClipboardCheck, Calendar as CalendarIcon, CheckCircle2, Clock } from 'lucide-react';

import { ScheduleTourDialog } from '@/components/features/verification/schedule-tour-dialog';
import { VerificationUploaderSection } from '@/components/features/verification/verification-uploader-section';

export default async function VerificationCenterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Verification');

  return (
    <div className="min-h-screen bg-sea-mist p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-deep-tide mb-2">{t('title', { fallback: 'Verification Audit Center' })}</h1>
          <p className="text-steel">{t('subtitle', { fallback: 'Elevate your trust level and win more buyers by completing our verification steps.' })}</p>
        </header>

        <div className="grid gap-6">
          {/* Level 1 */}
          <section className="bg-white rounded-xl shadow-sm border border-verified-green p-6 relative overflow-hidden">
            <div className="absolute top-0 end-0 bg-verified-green text-white px-3 py-1 rounded-bl-lg text-sm font-medium flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Completed
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-verified-green/10 text-verified-green rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-deep-tide mb-1">Level 1: Registered</h2>
                <p className="text-steel text-sm mb-4">Basic identity check including commercial register, tax card, and business license.</p>
                
                <div className="border border-gray-100 rounded-lg p-4 bg-gray-50 flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-sm">Business_License_2026.pdf</p>
                      <p className="text-xs text-steel">Verified on Aug 15, 2026</p>
                    </div>
                  </div>
                </div>

                <VerificationUploaderSection
                  label={locale === 'ar' ? 'رفع سجلات تجارية أو بطاقات ضريبية إضافية:' : 'Upload Additional Commercial / Tax Documents:'}
                  locale={locale}
                />
              </div>
            </div>
          </section>

          {/* Level 2 */}
          <section className="bg-white rounded-xl shadow-sm border border-signal-yellow p-6 relative overflow-hidden">
             <div className="absolute top-0 end-0 bg-signal-yellow text-deep-tide px-3 py-1 rounded-bl-lg text-sm font-medium flex items-center gap-1">
              <Clock className="w-4 h-4" /> Pending Video Call
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-signal-yellow/20 text-deep-tide rounded-lg">
                <Video className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-deep-tide mb-1">Level 2: Video-verified</h2>
                <p className="text-steel text-sm mb-4">Live production line tour with Marsa sourcing team to verify manufacturing capabilities.</p>
                
                <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 text-center">
                  <CalendarIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-deep-tide mb-4">Schedule your live factory tour</p>
                  <ScheduleTourDialog locale={locale} />
                </div>
              </div>
            </div>
          </section>

          {/* Level 3 */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 opacity-75">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-100 text-gray-500 rounded-lg">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-600 mb-1">Level 3: Audited</h2>
                <p className="text-steel text-sm mb-4">Third-party physical on-site audit report (SGS, TUV, etc.) providing full transparency to buyers.</p>
                
                <VerificationUploaderSection
                  label={locale === 'ar' ? 'رفع تقرير الفحص الميداني المعتمد (SGS / TÜV / Intertek):' : 'Upload Third-Party On-Site Audit Report:'}
                  description={locale === 'ar' ? 'يجب أن يكون التقرير صادراً خلال آخر 12 شهراً بصيغة PDF' : 'Report must be issued within the last 12 months in PDF format'}
                  locale={locale}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
