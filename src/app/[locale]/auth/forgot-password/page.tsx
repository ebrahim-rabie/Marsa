'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isAr = locale === 'ar';

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-4">
            <svg viewBox="4 24 92 72" className="h-8 w-auto text-[#0F4C5C]">
              <path fill="currentColor" d="M10 90V30h80v60H76V44H57v46H43V44H24v46z"/>
              <rect x="57" y="44" width="19" height="46" fill="#F2B01E"/>
            </svg>
            <span className="font-display text-2xl font-bold tracking-wide text-[#0F4C5C]">marsa</span>
          </Link>
          <h1 className="text-2xl font-bold font-display text-[#0F4C5C]">
            {isAr ? 'استعادة كلمة المرور' : 'Reset your password'}
          </h1>
        </div>

        <Card className="bg-white border-[#D2DDDB] shadow-md rounded-2xl">
          <CardContent className="pt-6">
            {submitted ? (
              <div className="text-center py-4 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#1B7A50] mx-auto" />
                <h3 className="font-bold text-[#0F4C5C] text-lg">
                  {isAr ? 'تم إرسال الرابط' : 'Reset Link Sent'}
                </h3>
                <p className="text-xs text-[#465A60] leading-relaxed">
                  {isAr
                    ? `أرسلنا رابط إعادة تعيين كلمة المرور إلى ${email}. يرجى فحص صندوق الوارد أو البريد غير المرغوب به.`
                    : `We sent a password reset link to ${email}. Please check your inbox or spam folder.`}
                </p>
                <Link href={`/${locale}/auth/login`}>
                  <Button variant="primary" className="w-full mt-4">
                    {isAr ? 'العودة لتسجيل الدخول' : 'Back to Login'}
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-[#465A60] leading-relaxed">
                  {isAr
                    ? 'أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً لإعادة تعيين كلمة المرور فوراً.'
                    : 'Enter your registered email and we will immediately send you a link to reset your password.'}
                </p>
                <Input
                  id="email"
                  type="email"
                  label={isAr ? 'البريد الإلكتروني' : 'Email Address'}
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  dir="ltr"
                  className="text-start"
                />
                <Button type="submit" variant="primary" className="w-full font-bold">
                  {isAr ? 'إرسال رابط الاستعادة' : 'Send Reset Link'}
                </Button>
                <div className="text-center pt-2">
                  <Link
                    href={`/${locale}/auth/login`}
                    className="text-xs text-[#0F4C5C] hover:underline"
                  >
                    {isAr ? 'العودة لتسجيل الدخول' : 'Back to sign in'}
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
