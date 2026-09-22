'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RoleSwitcherProps {
  locale: string;
}

export function RoleSwitcher({ locale }: RoleSwitcherProps) {
  const router = useRouter();
  const isAr = locale === 'ar';
  const [activeRole, setActiveRole] = useState<'buyer' | 'supplier' | 'admin'>('buyer');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Read cookie on mount
    const match = document.cookie.match(/marsa_demo_user=([^;]+)/);
    if (match) {
      const role = match[1] as 'buyer' | 'supplier' | 'admin';
      if (['buyer', 'supplier', 'admin'].includes(role)) {
        setActiveRole(role);
      }
    }
  }, []);

  const handleSwitch = (role: 'buyer' | 'supplier' | 'admin') => {
    document.cookie = `marsa_demo_user=${role}; path=/; max-age=604800`;
    setActiveRole(role);
    setIsOpen(false);

    let targetPath = `/${locale}/dashboard`;
    if (role === 'supplier') targetPath = `/${locale}/supplier-portal`;
    if (role === 'admin') targetPath = `/${locale}/admin`;

    router.push(targetPath);
    router.refresh();
  };

  const roleLabels = {
    buyer: {
      label: isAr ? 'وضع المشتري' : 'Buyer View',
      icon: '🏢',
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    supplier: {
      label: isAr ? 'وضع المصنع' : 'Supplier View',
      icon: '🏭',
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    admin: {
      label: isAr ? 'وضع الإدارة' : 'Admin View',
      icon: '🛡️',
      color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
  };

  return (
    <div className="relative inline-block text-start">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors hover:brightness-110 ${roleLabels[activeRole].color}`}
        title={isAr ? 'تبديل وضع العرض (مشتري / مصنع / إدارة)' : 'Switch View Mode'}
      >
        <span>{roleLabels[activeRole].icon}</span>
        <span className="hidden md:inline">{roleLabels[activeRole].label}</span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute end-0 mt-2 w-48 rounded-xl bg-[#0A2F38] border border-white/10 shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95">
          <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-white/50 border-b border-white/10 font-bold">
            {isAr ? 'تبديل الحساب كـ مستخدم:' : 'Switch Role View:'}
          </div>

          <button
            onClick={() => handleSwitch('buyer')}
            className={`w-full text-start px-3 py-2 text-xs flex items-center gap-2 hover:bg-white/10 transition-colors ${
              activeRole === 'buyer' ? 'text-[#F2B01E] font-bold bg-white/5' : 'text-white'
            }`}
          >
            <span>🏢</span>
            <div className="flex-1">
              <div>{isAr ? 'مشتري / مستورد' : 'Buyer / Importer'}</div>
              <div className="text-[10px] text-white/50 font-normal">
                {isAr ? 'طلب عروض ومقارنة أسعار' : 'RFQs & Quote Compare'}
              </div>
            </div>
            {activeRole === 'buyer' && <span className="text-xs">✓</span>}
          </button>

          <button
            onClick={() => handleSwitch('supplier')}
            className={`w-full text-start px-3 py-2 text-xs flex items-center gap-2 hover:bg-white/10 transition-colors ${
              activeRole === 'supplier' ? 'text-[#F2B01E] font-bold bg-white/5' : 'text-white'
            }`}
          >
            <span>🏭</span>
            <div className="flex-1">
              <div>{isAr ? 'مصنع / مورّد معتمد' : 'Verified Factory'}</div>
              <div className="text-[10px] text-white/50 font-normal">
                {isAr ? 'تقديم عروض وتوثيق' : 'Quote RFQs & Verification'}
              </div>
            </div>
            {activeRole === 'supplier' && <span className="text-xs">✓</span>}
          </button>

          <button
            onClick={() => handleSwitch('admin')}
            className={`w-full text-start px-3 py-2 text-xs flex items-center gap-2 hover:bg-white/10 transition-colors ${
              activeRole === 'admin' ? 'text-[#F2B01E] font-bold bg-white/5' : 'text-white'
            }`}
          >
            <span>🛡️</span>
            <div className="flex-1">
              <div>{isAr ? 'إدارة المنصة' : 'Admin Control'}</div>
              <div className="text-[10px] text-white/50 font-normal">
                {isAr ? 'المراحل وفض النزاعات' : 'Pipeline & Disputes'}
              </div>
            </div>
            {activeRole === 'admin' && <span className="text-xs">✓</span>}
          </button>
        </div>
      )}
    </div>
  );
}
