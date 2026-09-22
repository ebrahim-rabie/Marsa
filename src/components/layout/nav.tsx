'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export function Nav() {
  const t = useTranslations('Nav');
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn] = useState(false); // Mock state for demo

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 w-full bg-[#0F4C5C] text-white z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <svg viewBox="4 24 92 72" className="h-6 w-auto text-white">
                <path fill="currentColor" d="M10 90V30h80v60H76V44H57v46H43V44H24v46z"/>
                <rect x="57" y="44" width="19" height="46" fill="#F2B01E"/>
              </svg>
              <span className="font-display text-xl font-bold tracking-wide mt-1">marsa</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href={`/${locale}`} className="hover:text-[#F2B01E] transition-colors">{t('home', { fallback: 'Home' })}</Link>
            <Link href={`/${locale}/suppliers`} className="hover:text-[#F2B01E] transition-colors">{t('suppliers', { fallback: 'Suppliers' })}</Link>
            <Link href={`/${locale}#how-it-works`} className="hover:text-[#F2B01E] transition-colors">{t('howItWorks', { fallback: 'How it works' })}</Link>
          </div>

          {/* Actions & Lang */}
          <div className="hidden md:flex items-center gap-4">
            <Link href={`/${locale === 'ar' ? 'en' : 'ar'}`} className="text-sm font-medium hover:text-[#F2B01E] transition-colors uppercase">
              {locale === 'ar' ? 'EN' : 'عربي'}
            </Link>
            
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link href={`/${locale}/dashboard`} className="hover:text-[#F2B01E] transition-colors">{t('dashboard', { fallback: 'Dashboard' })}</Link>
                <div className="h-8 w-8 rounded-full bg-[#1B7A50] flex items-center justify-center cursor-pointer">
                  <span className="text-sm text-white font-bold">U</span>
                </div>
                <button className="text-sm text-white/70 hover:text-white transition-colors">{t('logout', { fallback: 'Logout' })}</button>
              </div>
            ) : (
              <Link 
                href={`/${locale}/request/new`} 
                className="bg-[#F2B01E] text-[#0A2F38] px-5 py-2 rounded-md font-bold hover:bg-yellow-500 transition-colors"
              >
                {t('sendRequest', { fallback: locale === 'ar' ? 'ابعت طلب شراء' : 'Send a buy request' })}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-white hover:text-[#F2B01E] focus:outline-none">
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
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={toggleMenu}>
          <div 
            className="w-64 bg-[#0F4C5C] h-full shadow-lg p-6 flex flex-col gap-6 absolute end-0 top-0 transition-transform" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <button onClick={toggleMenu} className="text-white hover:text-[#F2B01E]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              <Link href={`/${locale}`} onClick={toggleMenu} className="text-lg hover:text-[#F2B01E]">{t('home', { fallback: 'Home' })}</Link>
              <Link href={`/${locale}/suppliers`} onClick={toggleMenu} className="text-lg hover:text-[#F2B01E]">{t('suppliers', { fallback: 'Suppliers' })}</Link>
              <Link href={`/${locale}#how-it-works`} onClick={toggleMenu} className="text-lg hover:text-[#F2B01E]">{t('howItWorks', { fallback: 'How it works' })}</Link>
              
              <hr className="border-white/20 my-2" />
              
              <Link href={`/${locale === 'ar' ? 'en' : 'ar'}`} onClick={toggleMenu} className="text-lg hover:text-[#F2B01E] font-medium">
                {locale === 'ar' ? 'English' : 'عربي'}
              </Link>

              {isLoggedIn ? (
                <>
                  <Link href={`/${locale}/dashboard`} onClick={toggleMenu} className="text-lg hover:text-[#F2B01E]">{t('dashboard', { fallback: 'Dashboard' })}</Link>
                  <button className="text-start text-white/70 hover:text-white mt-2">{t('logout', { fallback: 'Logout' })}</button>
                </>
              ) : (
                <Link 
                  href={`/${locale}/request/new`} 
                  onClick={toggleMenu} 
                  className="bg-[#F2B01E] text-[#0A2F38] text-center px-4 py-3 rounded-md font-bold mt-4"
                >
                  {t('sendRequest', { fallback: locale === 'ar' ? 'ابعت طلب شراء' : 'Send a buy request' })}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
