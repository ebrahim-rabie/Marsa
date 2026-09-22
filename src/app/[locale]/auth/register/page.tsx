'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { registerAction } from '../actions';

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isAr = locale === 'ar';

  const [role, setRole] = useState<'buyer' | 'supplier'>('buyer');
  const [country, setCountry] = useState('EG');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    formData.append('role', role);
    formData.append('country', country);
    formData.append('locale', locale);

    startTransition(async () => {
      const res = await registerAction(formData);
      if (res.success && res.redirectTo) {
        router.push(res.redirectTo);
      } else if (res.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-4">
            <svg viewBox="4 24 92 72" className="h-8 w-auto text-[#0F4C5C]">
              <path fill="currentColor" d="M10 90V30h80v60H76V44H57v46H43V44H24v46z"/>
              <rect x="57" y="44" width="19" height="46" fill="#F2B01E"/>
            </svg>
            <span className="font-display text-2xl font-bold tracking-wide text-[#0F4C5C]">marsa</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#0F4C5C]">
            {isAr ? 'إنشاء حساب جديد على مرسى' : 'Create an account on Marsa'}
          </h1>
          <p className="text-xs text-[#465A60] mt-1.5">
            {isAr ? 'انضم إلى مجتمع التوريد الموثّق في مصر والصين' : 'Join verified B2B trade between Egypt and China'}
          </p>
        </div>

        {/* Card */}
        <Card className="bg-white border-[#D2DDDB] shadow-md rounded-2xl">
          <CardHeader className="pb-4 border-b border-[#D2DDDB]">
            <label className="text-xs font-bold text-[#465A60] block mb-2">
              {isAr ? 'نوع الحساب المطلوبة' : 'Select Account Type'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`p-3 rounded-xl border text-start transition-all ${
                  role === 'buyer'
                    ? 'border-[#0F4C5C] bg-[#E3EEED] ring-2 ring-[#0F4C5C]/20'
                    : 'border-[#D2DDDB] bg-white hover:bg-gray-50'
                }`}
              >
                <div className="text-lg mb-1">🏢</div>
                <div className="font-bold text-xs text-[#0F4C5C]">
                  {isAr ? 'مشتري / تاجر / مستورد' : 'Buyer / Importer'}
                </div>
                <div className="text-[11px] text-[#465A60] mt-0.5">
                  {isAr ? 'أبحث عن عروض مصانع' : 'Source from factories'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('supplier')}
                className={`p-3 rounded-xl border text-start transition-all ${
                  role === 'supplier'
                    ? 'border-[#0F4C5C] bg-[#E3EEED] ring-2 ring-[#0F4C5C]/20'
                    : 'border-[#D2DDDB] bg-white hover:bg-gray-50'
                }`}
              >
                <div className="text-lg mb-1">🏭</div>
                <div className="font-bold text-xs text-[#0F4C5C]">
                  {isAr ? 'مصنع / مورد معتمد' : 'Factory / Supplier'}
                </div>
                <div className="text-[11px] text-[#465A60] mt-0.5">
                  {isAr ? 'أقدم عروض على الطلبات' : 'Quote on real RFQs'}
                </div>
              </button>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="fullName"
                  name="fullName"
                  label={isAr ? 'الاسم بالكامل *' : 'Full Name *'}
                  placeholder="محمد أحمد"
                  required
                />
                <Input
                  id="companyName"
                  name="companyName"
                  label={isAr ? 'اسم الشركة / النشاط التجاري *' : 'Company Name *'}
                  placeholder="شركة الأمل للتجارة"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  label={isAr ? 'رقم الهاتف (واتساب فعال) *' : 'Phone (WhatsApp) *'}
                  placeholder="01012345678"
                  required
                  dir="ltr"
                  className="text-start"
                />
                <Select
                  id="country"
                  label={isAr ? 'الدولة المقر الرئيسي' : 'Country'}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  options={[
                    { value: 'EG', label: isAr ? 'مصر 🇪🇬 (Egypt)' : 'Egypt 🇪🇬' },
                    { value: 'CN', label: isAr ? 'الصين 🇨🇳 (China)' : 'China 🇨🇳' },
                  ]}
                />
              </div>

              <Input
                id="email"
                name="email"
                type="email"
                label={isAr ? 'البريد الإلكتروني للعمل *' : 'Work Email *'}
                placeholder="info@company.com"
                required
                dir="ltr"
                className="text-start"
              />

              <Input
                id="password"
                name="password"
                type="password"
                label={isAr ? 'كلمة المرور (8 خانات على الأقل) *' : 'Password (min 8 chars) *'}
                placeholder="••••••••"
                required
                dir="ltr"
                className="text-start"
              />

              <Button
                type="submit"
                variant="signal"
                className="w-full font-bold text-sm py-2.5"
                loading={isPending}
              >
                {isAr ? 'إنشاء الحساب وبدء الاستخدام' : 'Create Account & Get Started'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Link */}
        <p className="text-center text-xs text-[#465A60]">
          {isAr ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
          <Link
            href={`/${locale}/auth/login`}
            className="font-bold text-[#0F4C5C] hover:underline"
          >
            {isAr ? 'تسجيل الدخول' : 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  );
}
