'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { AlertCircle, UploadCloud } from 'lucide-react';

export default function NewDisputePage() {
  const t = useTranslations('NewDispute');
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get('order') || '';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(initialOrder);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Route back or to confirmation
      alert('Dispute submitted successfully');
    }, 1500);
  };

  return (
    <div className="container max-w-3xl mx-auto p-4 space-y-6 min-h-screen bg-sea-mist">
      <div>
        <h1 className="text-3xl font-display font-bold text-harbor-petrol mb-2">{t('title', { defaultMessage: 'File a Dispute' })}</h1>
        <p className="text-steel">{t('subtitle', { defaultMessage: 'Our arbitration team will review your case and mediate a resolution.' })}</p>
      </div>

      <div className="bg-alert-red/10 border-s-4 border-alert-red p-4 rounded-e-md flex items-start gap-3">
        <AlertCircle className="text-alert-red shrink-0 mt-0.5" />
        <p className="text-sm font-medium text-alert-red">
          {t('protectedFundsAlert', { defaultMessage: 'Upon submitting this dispute, release of the balance payment to the factory is immediately frozen until Marsa dispute arbitration investigates.' })}
        </p>
      </div>

      <Card className="bg-white shadow-sm border-gray-100">
        <CardHeader>
          <CardTitle className="text-harbor-petrol">{t('disputeDetails', { defaultMessage: 'Dispute Details' })}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="orderId" className="text-sm font-medium text-harbor-petrol">
                {t('orderNumber', { defaultMessage: 'Order Number' })}
              </label>
              <Input 
                id="orderId" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. ORD-0042"
                required
                className="border-gray-200 focus-visible:ring-harbor-petrol"
              />
            </div>

            <Select 
              id="reason"
              label={t('reason', { defaultMessage: 'Reason for Dispute' })}
              value={reason} 
              onChange={(e) => setReason(e.target.value)} 
              options={[
                { value: '', label: t('selectReason', { defaultMessage: 'Select a reason...' }) },
                { value: 'quality', label: t('reasonQuality', { defaultMessage: 'Quality mismatch' }) },
                { value: 'shortage', label: t('reasonShortage', { defaultMessage: 'Shortage in quantity' }) },
                { value: 'delay', label: t('reasonDelay', { defaultMessage: 'Production delay' }) },
                { value: 'damaged', label: t('reasonDamaged', { defaultMessage: 'Damaged packaging' }) },
                { value: 'specs', label: t('reasonSpecs', { defaultMessage: 'Wrong specification' }) },
              ]}
              required
            />

            <div className="space-y-2">
              <label htmlFor="details" className="text-sm font-medium text-harbor-petrol">
                {t('detailedExplanation', { defaultMessage: 'Detailed Explanation' })}
              </label>
              <Textarea 
                id="details" 
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={t('explanationPlaceholder', { defaultMessage: 'Please provide as much detail as possible about the issue...' })}
                rows={5}
                required
                className="border-gray-200 focus-visible:ring-harbor-petrol resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-harbor-petrol">
                {t('evidence', { defaultMessage: 'Evidence / Photos' })}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                <UploadCloud className="w-8 h-8 text-steel mb-2" />
                <p className="text-sm font-medium text-harbor-petrol">{t('uploadPhotos', { defaultMessage: 'Click to upload or drag and drop' })}</p>
                <p className="text-xs text-steel mt-1">SVG, PNG, JPG or PDF (max. 10MB)</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button type="button" variant="secondary" onClick={() => router.back()}>
                {t('cancel', { defaultMessage: 'Cancel' })}
              </Button>
              <Button type="submit" variant="destructive" disabled={isSubmitting} className="min-w-[150px]">
                {isSubmitting ? t('submitting', { defaultMessage: 'Submitting...' }) : t('submitDispute', { defaultMessage: 'Submit Dispute' })}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
