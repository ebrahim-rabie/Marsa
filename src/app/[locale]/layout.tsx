import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Bricolage_Grotesque, Reem_Kufi, IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import { Nav } from '@/components/layout/nav';
import { Footer } from '@/components/layout/footer';
import '../globals.css';

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const reemKufi = Reem_Kufi({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-ar-display',
});

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  weight: ['400', '500', '600', '700'],
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-ar-body',
});

export const metadata: Metadata = {
  title: 'مرسى | Marsa — من الطلب إلى المرسى',
  description: 'منصة توريد تدير صفقات الاستيراد والمصانع من الطلب حتى وصول البضاعة إلى مخزنك',
};

export const viewport: Viewport = {
  viewportFit: 'cover',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  
  const messages = await getMessages();

  return (
    <html lang={locale} dir={dir} className={`
      ${bricolageGrotesque.variable} 
      ${reemKufi.variable} 
      ${ibmPlexSans.variable} 
      ${ibmPlexSansArabic.variable}
    `}>
      <body className="min-h-screen flex flex-col bg-[#F3F7F6] text-[#0A2F38]">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Nav />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
