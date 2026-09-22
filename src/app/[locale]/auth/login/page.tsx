'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { loginAction } from '../actions';
import { ShieldCheck, ArrowRight, Lock, Mail, Phone } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isAr = locale === 'ar';

  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    formData.append('locale', locale);

    startTransition(async () => {
      const res = await loginAction(formData);
      if (res.success && res.redirectTo) {
        router.push(res.redirectTo);
      } else if (res.error) {
        setError(res.error);
      }
    });
  };

  const handleDemoLogin = (role: 'buyer' | 'supplier' | 'admin') => {
    setError('');
    const formData = new FormData();
    formData.append('locale', locale);
    formData.append('demoRole', role);

    startTransition(async () => {
      const res = await loginAction(formData);
      if (res.success && res.redirectTo) {
        router.push(res.redirectTo);
      }
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
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
            {isAr ? 'تسجيل الدخول إلى مرسى' : 'Welcome back to Marsa'}
          </h1>
          <p className="text-xs text-[#465A60] mt-1.5">
            {isAr ? 'منصة الصفقات الموثّقة والتوريد المباشر' : 'Verified B2B trade & sourcing platform'}
          </p>
        </div>

        {/* Auth Card */}
        <Card className="bg-white border-[#D2DDDB] shadow-md rounded-2xl">
          <CardHeader className="pb-3 border-b border-[#D2DDDB]">
            <div className="flex bg-[#F3F7F6] p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab('email')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activeTab === 'email' ? 'bg-white text-[#0F4C5C] shadow-sm' : 'text-[#465A60]'
                }`}
              >
                {isAr ? 'البريد الإلكتروني' : 'Email & Password'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('phone')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activeTab === 'phone' ? 'bg-white text-[#0F4C5C] shadow-sm' : 'text-[#465A60]'
                }`}
              >
                {isAr ? 'رمز هاتف (OTP)' : 'Phone OTP'}
              </button>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {error}
              </div>
            )}

            {activeTab === 'email' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label={isAr ? 'البريد الإلكتروني' : 'Email address'}
                  placeholder="name@company.com"
                  required
                  dir="ltr"
                  className="text-start"
                />

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-[#465A60]">
                      {isAr ? 'كلمة المرور' : 'Password'}
                    </label>
                    <Link
                      href={`/${locale}/auth/forgot-password`}
                      className="text-xs text-[#0F4C5C] hover:underline"
                    >
                      {isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    dir="ltr"
                    className="text-start"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full font-bold"
                  loading={isPending}
                >
                  {isAr ? 'تسجيل الدخول' : 'Sign in'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  label={isAr ? 'رقم الهاتف (واتساب)' : 'Mobile Phone (WhatsApp)'}
                  placeholder="01012345678"
                  required
                  dir="ltr"
                  className="text-start"
                />
                <Button
                  type="button"
                  variant="signal"
                  className="w-full font-bold"
                  onClick={() => alert(isAr ? 'تم إرسال كود التأكيد عبر واتساب: 123456' : 'OTP code sent via WhatsApp: 123456')}
                >
                  {isAr ? 'إرسال كود التأكيد (WhatsApp OTP)' : 'Send WhatsApp OTP'}
                </Button>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  label={isAr ? 'كود التحقق المكون من 6 أرقام' : '6-digit OTP code'}
                  placeholder="123456"
                  dir="ltr"
                  className="text-center font-mono tracking-widest text-lg"
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full font-bold"
                  loading={isPending}
                >
                  {isAr ? 'تحقق ودخول' : 'Verify & Sign in'}
                </Button>
              </form>
            )}

            {/* Quick Demo Access Bar */}
            <div className="mt-6 pt-5 border-t border-[#D2DDDB]">
              <p className="text-[11px] font-bold text-[#465A60] mb-2 text-center uppercase tracking-wider">
                {isAr ? 'تجربة سريعة بدون إدخال بيانات (Demo Access)' : 'Quick Demo One-Click Access'}
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('buyer')}
                  className="py-1.5 px-2 bg-[#E3EEED] hover:bg-[#D2DDDB] text-[#0F4C5C] text-xs font-semibold rounded-lg transition-colors text-center"
                >
                  {isAr ? 'مشتري 🏢' : 'Buyer 🏢'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('supplier')}
                  className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-lg transition-colors text-center"
                >
                  {isAr ? 'مصنع 🏭' : 'Factory 🏭'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin')}
                  className="py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-semibold rounded-lg transition-colors text-center"
                >
                  {isAr ? 'إدارة 🛡️' : 'Admin 🛡️'}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Link */}
        <p className="text-center text-xs text-[#465A60]">
          {isAr ? 'ليس لديك حساب بعد؟' : "Don't have an account yet?"}{' '}
          <Link
            href={`/${locale}/auth/register`}
            className="font-bold text-[#0F4C5C] hover:underline"
          >
            {isAr ? 'إنشاء حساب جديد' : 'Create an account'}
          </Link>
        </p>
      </div>
    </div>
  );
}
