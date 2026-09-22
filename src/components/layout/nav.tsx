'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';

import { RoleSwitcher } from './role-switcher';

export function Nav() {
  const t = useTranslations('Nav');
  const params = useParams();
  const pathname = usePathname() || '';
  const locale = (params?.locale as string) || 'ar';
  const isAr = locale === 'ar';
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Compute equivalent URL for other language
  const targetLocale = locale === 'ar' ? 'en' : 'ar';
  const switchLangUrl = pathname.startsWith(`/${locale}`)
    ? pathname.replace(`/${locale}`, `/${targetLocale}`)
    : `/${targetLocale}`;

  return (
    <nav className="fixed top-0 w-full bg-[#0F4C5C] text-white z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <svg viewBox="4 24 92 72" className="h-7 w-auto text-white">
                <path fill="currentColor" d="M10 90V30h80v60H76V44H57v46H43V44H24v46z" />
                <rect x="57" y="44" width="19" height="46" fill="#F2B01E" />
              </svg>
              <span className="font-display text-xl font-bold tracking-wide mt-1">marsa</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-5 text-sm font-medium">
              <Link href={`/${locale}`} className="hover:text-[#F2B01E] transition-colors">
                {t('home', { fallback: isAr ? 'الرئيسية' : 'Home' })}
              </Link>
              <Link href={`/${locale}/suppliers`} className="hover:text-[#F2B01E] transition-colors">
                {t('suppliers', { fallback: isAr ? 'دليل المصانع' : 'Suppliers' })}
              </Link>
              <Link href={`/${locale}/dashboard`} className="hover:text-[#F2B01E] transition-colors">
                {t('dashboard', { fallback: isAr ? 'لوحة المشتري' : 'Dashboard' })}
              </Link>
              <Link href={`/${locale}/supplier-portal`} className="hover:text-[#F2B01E] transition-colors text-white/80">
                {isAr ? 'بوابة المصانع' : 'Supplier Portal'}
              </Link>
              <Link href={`/${locale}/admin`} className="hover:text-[#F2B01E] transition-colors text-white/70">
                {isAr ? 'الإدارة' : 'Admin'}
              </Link>
            </div>
          </div>

          {/* Right Actions & Language Switcher */}
          <div className="hidden sm:flex items-center gap-3">
            <RoleSwitcher locale={locale} />

            <Link
              href={switchLangUrl}
              className="text-xs font-bold px-2.5 py-1.5 rounded border border-white/20 hover:border-[#F2B01E] hover:text-[#F2B01E] transition-colors uppercase"
            >
              {locale === 'ar' ? 'English' : 'عربي'}
            </Link>

            <Link
              href={`/${locale}/auth/login`}
              className="text-sm font-medium hover:text-[#F2B01E] transition-colors px-2 py-1"
            >
              {isAr ? 'تسجيل الدخول' : 'Sign in'}
            </Link>

            <Link
              href={`/${locale}/request/new`}
              className="bg-[#F2B01E] text-[#0A2F38] px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors shadow-sm"
            >
              {isAr ? 'ابعت طلب شراء' : 'Send Buy Request'}
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="lg:hidden flex items-center gap-3">
            <Link
              href={switchLangUrl}
              className="text-xs font-bold px-2 py-1 rounded border border-white/20 uppercase"
            >
              {locale === 'ar' ? 'EN' : 'عربي'}
            </Link>
            <button
              onClick={toggleMenu}
              className="text-white hover:text-[#F2B01E] p-1.5 focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60" onClick={toggleMenu}>
          <div
            className="w-72 bg-[#0F4C5C] h-full shadow-2xl p-6 flex flex-col gap-5 absolute end-0 top-0 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="font-display font-bold text-lg text-white">مرسى | Marsa</span>
              <button onClick={toggleMenu} className="text-white hover:text-[#F2B01E]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-3 font-medium text-sm">
              <Link href={`/${locale}`} onClick={toggleMenu} className="py-2 hover:text-[#F2B01E]">
                {isAr ? 'الرئيسية' : 'Home'}
              </Link>
              <Link href={`/${locale}/suppliers`} onClick={toggleMenu} className="py-2 hover:text-[#F2B01E]">
                {isAr ? 'دليل المصانع الموثّقة' : 'Verified Suppliers'}
              </Link>
              <Link href={`/${locale}/dashboard`} onClick={toggleMenu} className="py-2 hover:text-[#F2B01E]">
                {isAr ? 'لوحة تحكم المشتري' : 'Buyer Dashboard'}
              </Link>
              <Link href={`/${locale}/supplier-portal`} onClick={toggleMenu} className="py-2 hover:text-[#F2B01E]">
                {isAr ? 'بوابة الموردين والمصانع' : 'Supplier Portal'}
              </Link>
              <Link href={`/${locale}/admin`} onClick={toggleMenu} className="py-2 hover:text-[#F2B01E]">
                {isAr ? 'لوحة تحكم الإدارة' : 'Admin Control'}
              </Link>

              <hr className="border-white/10 my-2" />

              <Link href={`/${locale}/auth/login`} onClick={toggleMenu} className="py-2 text-[#F2B01E] font-bold">
                {isAr ? 'تسجيل الدخول' : 'Sign in'}
              </Link>
              <Link href={`/${locale}/auth/register`} onClick={toggleMenu} className="py-2 hover:text-[#F2B01E]">
                {isAr ? 'إنشاء حساب جديد' : 'Register Account'}
              </Link>

              <div className="mt-4">
                <Link
                  href={`/${locale}/request/new`}
                  onClick={toggleMenu}
                  className="block w-full text-center bg-[#F2B01E] text-[#0A2F38] py-3 rounded-lg font-bold shadow-md hover:bg-yellow-400"
                >
                  {isAr ? 'ابعت طلب شراء الآن' : 'Send Buy Request'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
