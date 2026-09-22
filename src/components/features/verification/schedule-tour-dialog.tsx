'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, CheckCircle2, Clock, Video } from 'lucide-react';

interface ScheduleTourDialogProps {
  locale: string;
}

export function ScheduleTourDialog({ locale }: ScheduleTourDialogProps) {
  const isAr = locale === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [date, setDate] = useState('2026-10-14');
  const [slot, setSlot] = useState('10:00 AM');
  const [contact, setContact] = useState('+86 138 0000 1234');
  const [line, setLine] = useState('Carton Corrugation & Die-Cutting Line');

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsConfirmed(true);
    }, 600);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsConfirmed(false);
    }, 300);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 bg-[#0F4C5C] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#0F4C5C]/90 transition-colors shadow-sm"
      >
        <Calendar className="w-4 h-4" />
        {isAr ? 'حجز موعد جولة التوثيق بالفيديو' : 'Schedule Live Video Tour'}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={isAr ? 'حجز موعد جولة التوثيق بالفيديو (المستوى 2)' : 'Book Level 2 Live Video Audit'}
        description={
          isAr
            ? 'جولة مباشرة لمدة 20 دقيقة عبر مكالمة فيديو للتحقق من خطوط الإنتاج والمعدات'
            : 'A 20-minute live video tour verifying manufacturing facilities and equipment'
        }
      >
        {isConfirmed ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-[#1B7A50] mx-auto animate-in zoom-in" />
            <h3 className="text-xl font-bold text-[#0F4C5C]">
              {isAr ? 'تم تأكيد موعد التوثيق بنجاح!' : 'Video Tour Confirmed!'}
            </h3>
            <div className="bg-[#E3EEED]/50 p-4 rounded-xl max-w-sm mx-auto text-sm text-[#0F4C5C] space-y-1">
              <p className="font-semibold flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" /> {date}
              </p>
              <p className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" /> {slot} (Cairo Time) / 4:00 PM (Beijing Time)
              </p>
            </div>
            <p className="text-xs text-[#465A60] max-w-sm mx-auto">
              {isAr
                ? 'سيتواصل معك مهندس الجودة الميداني من مرسى عبر WhatsApp/WeChat لتأكيد الاتصال وبدء الجولة الحية.'
                : 'A Marsa technical auditor will reach out via WhatsApp/WeChat 30 mins before the scheduled tour.'}
            </p>
            <div className="pt-2">
              <Button variant="primary" onClick={handleClose}>
                {isAr ? 'تم، إغلاق' : 'Done, Close'}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConfirm} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-[#0F4C5C] mb-1 block">
                {isAr ? 'تاريخ الجولة المقترح' : 'Proposed Date'}
              </label>
              <Input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="font-mono text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#0F4C5C] mb-1 block">
                {isAr ? 'التوقيت المناسب' : 'Preferred Time Slot'}
              </label>
              <select
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className="w-full h-10 rounded-md border border-[#D2DDDB] px-3 text-xs bg-white text-[#0F4C5C] font-medium"
              >
                <option value="10:00 AM">10:00 AM Cairo (04:00 PM China)</option>
                <option value="11:30 AM">11:30 AM Cairo (05:30 PM China)</option>
                <option value="02:00 PM">02:00 PM Cairo (08:00 PM China)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#0F4C5C] mb-1 block">
                {isAr ? 'خط الإنتاج المراد فحصه' : 'Production Line to Inspect'}
              </label>
              <Input
                required
                value={line}
                onChange={(e) => setLine(e.target.value)}
                placeholder="e.g. Corrugated Packaging Line 1"
                className="text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#0F4C5C] mb-1 block">
                {isAr ? 'رقم الاتصال للمسؤول الميداني (WhatsApp/WeChat)' : 'Auditee Contact (WhatsApp/WeChat)'}
              </label>
              <Input
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+86..."
                className="font-mono text-sm"
                dir="ltr"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#D2DDDB]">
              <Button type="button" variant="secondary" size="sm" onClick={handleClose}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button type="submit" variant="signal" size="sm" loading={isSubmitting}>
                {isAr ? 'تأكيد الحجز' : 'Confirm Booking'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
