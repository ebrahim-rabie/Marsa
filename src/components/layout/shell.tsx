'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export function Shell({ children, isAdmin = false }: { children: React.ReactNode, isAdmin?: boolean }) {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const buyerLinks = [
    { name: locale === 'ar' ? 'نظرة عامة' : 'Overview', href: `/${locale}/dashboard`, icon: 'Home' },
    { name: locale === 'ar' ? 'طلباتي' : 'Requests', href: `/${locale}/dashboard/requests`, icon: 'FileText' },
    { name: locale === 'ar' ? 'الطلبيات' : 'Orders', href: `/${locale}/dashboard/orders`, icon: 'Package' },
    { name: locale === 'ar' ? 'المستندات' : 'Documents', href: `/${locale}/dashboard/documents`, icon: 'Folder' },
    { name: locale === 'ar' ? 'الإعدادات' : 'Settings', href: `/${locale}/dashboard/settings`, icon: 'Settings' },
  ];

  const adminLinks = [
    { name: locale === 'ar' ? 'إدارة الطلبات' : 'Manage Requests', href: `/${locale}/admin/requests`, icon: 'List' },
    { name: locale === 'ar' ? 'إدارة الطلبيات' : 'Manage Orders', href: `/${locale}/admin/orders`, icon: 'Archive' },
    { name: locale === 'ar' ? 'إدارة الموردين' : 'Manage Suppliers', href: `/${locale}/admin/suppliers`, icon: 'Users' },
    { name: locale === 'ar' ? 'النزاعات' : 'Disputes', href: `/${locale}/admin/disputes`, icon: 'AlertTriangle' },
    { name: locale === 'ar' ? 'التقارير' : 'Reports', href: `/${locale}/admin/reports`, icon: 'BarChart' },
  ];

  const links = isAdmin ? [...buyerLinks, ...adminLinks] : buyerLinks;

  return (
    <div className="flex h-screen bg-[#F3F7F6] overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-[250px]' : 'w-[70px]'} 
        bg-[#0F4C5C] text-white flex-shrink-0 transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          {isSidebarOpen && (
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <svg viewBox="4 24 92 72" className="h-6 w-auto text-white">
                <path fill="currentColor" d="M10 90V30h80v60H76V44H57v46H43V44H24v46z"/>
                <rect x="57" y="44" width="19" height="46" fill="#F2B01E"/>
              </svg>
              <span className="font-display text-lg font-bold tracking-wide mt-1">marsa</span>
            </Link>
          )}
          <button onClick={toggleSidebar} className="text-white/70 hover:text-white p-1 rounded-md">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors
                    ${isActive ? 'bg-[#F2B01E] text-[#0A2F38] font-semibold' : 'text-white/80 hover:bg-white/10 hover:text-white'}
                  `}
                  title={!isSidebarOpen ? link.name : undefined}
                >
                  <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center opacity-80">
                    <span className="w-2 h-2 rounded-full bg-current"></span>
                  </div>
                  {isSidebarOpen && <span>{link.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-[#465A60]">
            <Link href={`/${locale}/dashboard`} className="hover:text-[#0F4C5C]">Dashboard</Link>
            <span>/</span>
            <span className="font-medium text-[#0A2F38]">Current Page</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-[#465A60] hover:text-[#0F4C5C] relative p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 end-1 w-2 h-2 bg-[#B42318] rounded-full"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-[#1B7A50] text-white flex items-center justify-center font-bold text-sm">
              U
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 text-[#0A2F38]">
          {children}
        </main>
      </div>
    </div>
  );
}
