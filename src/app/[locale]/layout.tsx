import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Bricolage_Grotesque, Reem_Kufi, IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import './globals.css';

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
  title: 'Marsa — From request to receipt',
  description: 'Marsa B2B sourcing platform',
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
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
