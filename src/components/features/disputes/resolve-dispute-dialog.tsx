'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

interface ResolveDisputeDialogProps {
  orderId: string;
  reason: string;
  isUrgent?: boolean;
  locale: string;
}

export function ResolveDisputeDialog({
  orderId,
  reason,
  isUrgent,
  locale,
}: ResolveDisputeDialogProps) {
  const isAr = locale === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [decision, setDecision] = useState<'refund_buyer' | 'release_supplier' | 'mediated_settlement'>('refund_buyer');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsResolved(true);
    }, 600);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsResolved(false);
    }, 300);
  };

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="w-full text-[#0F4C5C] border-[#0F4C5C] hover:bg-[#0F4C5C]/5 text-xs font-semibold"
      >
        {isAr ? 'متابعة وفض النزاع' : 'Resolve Dispute'}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={isAr ? `فض نزاع الأوردر: ${orderId}` : `Arbitrate Dispute: ${orderId}`}
        description={
          isAr
            ? `السبب المسجل: ${reason} ${isUrgent ? '• (حالة عاجلة)' : ''}`
            : `Reason: ${reason} ${isUrgent ? '• (Urgent Case)' : ''}`
        }
      >
        {isResolved ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-[#1B7A50] mx-auto animate-in zoom-in" />
            <h3 className="text-xl font-bold text-[#0F4C5C]">
              {isAr ? 'تم تنفيذ قرار التحكيم وفك تجميد المستحقات' : 'Arbitration Ruling Executed!'}
            </h3>
            <p className="text-sm text-[#465A60] max-w-sm mx-auto">
              {isAr
                ? 'تم إخطار طرفي الصفقة (المشتري والمصنع) بالقرار النهائي وتسوية الحساب المشروط وفقاً لبنود التحكيم المعتمدة.'
                : 'Both buyer and manufacturer have been formally notified and the escrow balance adjusted accordingly.'}
            </p>
            <div className="pt-2">
              <Button variant="primary" onClick={handleClose}>
                {isAr ? 'تم، إغلاق' : 'Done, Close'}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleResolve} className="space-y-4 pt-2">
            <div className="bg-amber-50 border-s-4 border-amber-500 p-3 rounded-e-md text-xs text-amber-900">
              <p className="font-semibold flex items-center gap-1.5 mb-1">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                {isAr ? 'مستحقات مجمدة في الضمان المشروط: $31,500' : 'Frozen Escrow Funds: $31,500'}
              </p>
              <p className="text-amber-800">
                {isAr
                  ? 'تم تعليق الإفراج عن الدفعة النهائية بناءً على شكوى عدم مطابقة فحص الجودة المسبق.'
                  : 'Final disbursement frozen pending inspection defect audit review.'}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#0F4C5C] block">
                {isAr ? 'قرار لجنة التحكيم المعتمد' : 'Arbitration Decision'}
              </label>

              <div className="space-y-2">
                <label className="flex items-start gap-2.5 p-3 rounded-lg border border-[#D2DDDB] cursor-pointer hover:bg-[#F3F7F6] transition-colors">
                  <input
                    type="radio"
                    name="decision"
                    value="refund_buyer"
                    checked={decision === 'refund_buyer'}
                    onChange={() => setDecision('refund_buyer')}
                    className="mt-0.5 text-[#0F4C5C] focus:ring-[#0F4C5C]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#0F4C5C]">
                      {isAr ? 'إعادة كامل المبلغ للمشتري (Refund Buyer)' : 'Full Refund to Buyer'}
                    </div>
                    <div className="text-[11px] text-[#465A60]">
                      {isAr
                        ? 'بناءً على تجاوز نسبة العيوب المسموح بها في تقرير فحص SGS.'
                        : 'Defect rate exceeded contract tolerance per SGS audit.'}
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-lg border border-[#D2DDDB] cursor-pointer hover:bg-[#F3F7F6] transition-colors">
                  <input
                    type="radio"
                    name="decision"
                    value="mediated_settlement"
                    checked={decision === 'mediated_settlement'}
                    onChange={() => setDecision('mediated_settlement')}
                    className="mt-0.5 text-[#0F4C5C] focus:ring-[#0F4C5C]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#0F4C5C]">
                      {isAr ? 'تسوية ودية بخصم 15% (Mediated Settlement)' : 'Mediated Settlement (15% Discount)'}
                    </div>
                    <div className="text-[11px] text-[#465A60]">
                      {isAr
                        ? 'خصم 15% لصالح المشتري والإفراج عن الباقي للمصنع مع شحن البضاعة.'
                        : 'Compromise settlement releasing 85% to factory and 15% rebate to buyer.'}
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-lg border border-[#D2DDDB] cursor-pointer hover:bg-[#F3F7F6] transition-colors">
                  <input
                    type="radio"
                    name="decision"
                    value="release_supplier"
                    checked={decision === 'release_supplier'}
                    onChange={() => setDecision('release_supplier')}
                    className="mt-0.5 text-[#0F4C5C] focus:ring-[#0F4C5C]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#0F4C5C]">
                      {isAr ? 'رفض النزاع والإفراج عن المبلغ للمصنع' : 'Release Balance to Supplier'}
                    </div>
                    <div className="text-[11px] text-[#465A60]">
                      {isAr
                        ? 'التحقق من أن البضاعة مطابقة للعينة المعتمدة هندسياً.'
                        : 'Goods verified to be compliant with signed golden master specs.'}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#0F4C5C] mb-1 block">
                {isAr ? 'ملاحظات وتوجيهات لجنة التحكيم' : 'Arbitration Order Notes'}
              </label>
              <textarea
                rows={2}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder={isAr ? 'اكتب حيثيات القرار لإرسالها للطرفين...' : 'Add formal order notes for both parties...'}
                className="w-full rounded-md border border-[#D2DDDB] p-2 text-xs focus:ring-[#0F4C5C] focus:border-[#0F4C5C] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#D2DDDB]">
              <Button type="button" variant="secondary" size="sm" onClick={handleClose}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button type="submit" variant="destructive" size="sm" loading={isSubmitting}>
                {isAr ? 'تنفيذ القرار وتسوية الحساب' : 'Execute Ruling'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
