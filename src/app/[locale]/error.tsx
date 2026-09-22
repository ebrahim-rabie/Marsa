'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Marsa application error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 bg-[#B42318]/10 text-[#B42318] rounded-2xl flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#0F4C5C] mb-3">
        حصل خطأ غير متوقع في التحميل
      </h1>

      <p className="text-[#465A60] max-w-md mb-8 text-sm leading-relaxed">
        حدث عطل تقني مؤقت أثناء معالجة طلبك. بياناتك وصفقاتك محمية بالكامل ولم تتأثر.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button variant="primary" size="md" onClick={() => reset()}>
          إعادة المحاولة الآن
        </Button>
        <a
          href="https://wa.me/201000000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D9%88%D8%A7%D8%AC%D9%87%D8%AA%20%D8%AE%D8%B7%D8%A3%20%D9%81%D9%8A%20%D8%A7%D9%84%D9%85%D9%88%D9%82%D8%B9"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-white border border-[#D2DDDB] hover:bg-gray-50 text-[#0F4C5C] text-sm font-semibold h-10 px-4 rounded-md transition-colors"
        >
          الدعم الفني عبر واتساب
        </a>
      </div>
    </div>
  );
}
