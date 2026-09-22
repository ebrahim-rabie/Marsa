'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2 } from 'lucide-react';

interface QuoteSubmissionDialogProps {
  rfqTitle: string;
  rfqQuantity: string;
  destination: string;
  locale: string;
}

export function QuoteSubmissionDialog({
  rfqTitle,
  rfqQuantity,
  destination,
  locale,
}: QuoteSubmissionDialogProps) {
  const isAr = locale === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    unitPrice: '',
    currency: 'USD',
    moq: '5000',
    leadTimeDays: '15',
    incoterm: 'FOB',
    sampleAvailable: true,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 300);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-[#0F4C5C] text-white py-2 rounded-lg font-medium hover:bg-[#0F4C5C]/90 transition-colors shadow-sm text-sm"
      >
        {isAr ? 'تقديم عرض سعر' : 'Submit Quote'}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={isAr ? 'تقديم عرض سعر رسمي' : 'Submit Formal Quote'}
        description={
          isAr
            ? `الطلب: ${rfqTitle} (${rfqQuantity} وحدة) - الوجهة: ${destination}`
            : `Request: ${rfqTitle} (${rfqQuantity} units) - Dest: ${destination}`
        }
      >
        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-[#1B7A50] mx-auto animate-in zoom-in" />
            <h3 className="text-xl font-bold text-[#0F4C5C]">
              {isAr ? 'تم إرسال عرض السعر بنجاح!' : 'Quote Submitted Successfully!'}
            </h3>
            <p className="text-sm text-[#465A60] max-w-sm mx-auto">
              {isAr
                ? 'تم إرسال عرضك للمشتري وسيتم تضمينه في جدول المقارنة الذكية. ستصلك إشعارات عند قبول العرض وبدء مرحلة التعاقد والدفع المشروط.'
                : 'Your quote has been delivered to the buyer and included in the side-by-side comparison. You will be notified once accepted.'}
            </p>
            <div className="pt-2">
              <Button variant="primary" onClick={handleClose}>
                {isAr ? 'تم، إغلاق' : 'Done, Close'}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#0F4C5C] mb-1 block">
                  {isAr ? 'سعر الوحدة من المصنع' : 'Unit Price (EXW/FOB)'}
                </label>
                <div className="flex gap-1">
                  <Input
                    required
                    type="number"
                    step="0.01"
                    placeholder="0.45"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                    className="font-mono text-sm"
                  />
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="rounded-md border border-[#D2DDDB] px-2 text-xs bg-white text-[#0F4C5C] font-semibold"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EGP">EGP (ج.م)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0F4C5C] mb-1 block">
                  {isAr ? 'أقل كمية طلب (MOQ)' : 'Minimum Order (MOQ)'}
                </label>
                <Input
                  required
                  type="number"
                  placeholder="5000"
                  value={formData.moq}
                  onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#0F4C5C] mb-1 block">
                  {isAr ? 'مدة التصنيع (أيام)' : 'Lead Time (Days)'}
                </label>
                <Input
                  required
                  type="number"
                  placeholder="15"
                  value={formData.leadTimeDays}
                  onChange={(e) => setFormData({ ...formData, leadTimeDays: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0F4C5C] mb-1 block">
                  {isAr ? 'شرط التسليم' : 'Incoterm'}
                </label>
                <select
                  value={formData.incoterm}
                  onChange={(e) => setFormData({ ...formData, incoterm: e.target.value })}
                  className="w-full h-10 rounded-md border border-[#D2DDDB] px-3 text-xs bg-white text-[#0F4C5C] font-medium"
                >
                  <option value="FOB">FOB (شامل تسليم الميناء)</option>
                  <option value="EXW">EXW (أرض المصنع)</option>
                  <option value="CIF">CIF (شامل الشحن والتأمين)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="sample"
                type="checkbox"
                checked={formData.sampleAvailable}
                onChange={(e) => setFormData({ ...formData, sampleAvailable: e.target.checked })}
                className="rounded border-[#D2DDDB] text-[#0F4C5C] focus:ring-[#0F4C5C]"
              />
              <label htmlFor="sample" className="text-xs text-[#0F4C5C] font-medium cursor-pointer">
                {isAr
                  ? 'مستعدون لإرسال عينة فحص مطابقة للمواصفات'
                  : 'Ready to dispatch an inspection sample'}
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#D2DDDB]">
              <Button type="button" variant="secondary" size="sm" onClick={handleClose}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button type="submit" variant="signal" size="sm" loading={isSubmitting}>
                {isAr ? 'إرسال العرض للمشتري' : 'Send Quote'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
