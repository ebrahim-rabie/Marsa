import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 bg-[#0F4C5C]/10 rounded-2xl flex items-center justify-center mb-6">
        <svg viewBox="4 24 92 72" className="h-10 w-auto text-[#0F4C5C]">
          <path fill="currentColor" d="M10 90V30h80v60H76V44H57v46H43V44H24v46z"/>
          <rect x="57" y="44" width="19" height="46" fill="#F2B01E"/>
        </svg>
      </div>
      
      <span className="font-mono text-xs font-bold bg-[#F2B01E]/20 text-[#2E2200] px-3 py-1 rounded-full mb-3">
        404 — خطأ في المسار
      </span>
      
      <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#0F4C5C] mb-3">
        ضللت الطريق في المرسى؟
      </h1>
      
      <p className="text-[#465A60] max-w-md mb-8 text-sm leading-relaxed">
        الصفحة التي تبحث عنها غير موجودة أو تم نقلها. لكن لا تقلق، صفقاتك وشحناتك بأمان تام.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link href="/ar">
          <Button variant="signal" size="md">
            العودة إلى الصفحة الرئيسية
          </Button>
        </Link>
        <Link href="/ar/suppliers">
          <Button variant="secondary" size="md">
            تصفح دليل المصانع
          </Button>
        </Link>
      </div>
    </div>
  );
}
