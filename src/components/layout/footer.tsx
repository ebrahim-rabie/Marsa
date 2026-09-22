import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'Nav' });

  return (
    <footer className="bg-[#0F4C5C] text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4">
              <svg viewBox="4 24 92 72" className="h-5 w-auto text-white">
                <path fill="currentColor" d="M10 90V30h80v60H76V44H57v46H43V44H24v46z"/>
                <rect x="57" y="44" width="19" height="46" fill="#F2B01E"/>
              </svg>
              <span className="font-display text-lg font-bold tracking-wide mt-1">marsa</span>
            </Link>
            <p className="text-white/70 max-w-sm mt-4 text-sm leading-relaxed">
              {locale === 'ar' 
                ? 'مرسى بيتحقق من المورد، بيحمي الدفع، وبيتابع الشحنة لحد ما توصل.'
                : 'Marsa checks the supplier, protects your payment, and follows the shipment until it arrives.'}
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-[#F2B01E]">{t('quickLinks', { fallback: locale === 'ar' ? 'روابط سريعة' : 'Quick Links' })}</h3>
            <ul className="flex flex-col gap-2 text-sm text-white/80">
              <li><Link href={`/${locale}/about`} className="hover:text-white transition-colors">{t('about', { fallback: locale === 'ar' ? 'عن مرسى' : 'About Us' })}</Link></li>
              <li><Link href={`/${locale}/terms`} className="hover:text-white transition-colors">{t('terms', { fallback: locale === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions' })}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-[#F2B01E]">{t('contact', { fallback: locale === 'ar' ? 'تواصل معنا' : 'Contact' })}</h3>
            <ul className="flex flex-col gap-2 text-sm text-white/80">
              <li>
                <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/50">
          <p>© 2026 Marsa. {locale === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
}
