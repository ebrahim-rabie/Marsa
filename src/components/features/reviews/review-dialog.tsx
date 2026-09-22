'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ReviewDialogProps {
  orderId: string;
  factoryName: string;
  onReviewSubmit?: (data: ReviewData) => void;
}

export interface ReviewData {
  overall: number;
  quality: number;
  communication: number;
  delivery: number;
  comment: string;
}

const StarRating = ({ rating, onChange }: { rating: number; onChange: (rating: number) => void }) => {
  return (
    <div className="flex gap-1" dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-2xl transition-colors ${
            rating >= star ? 'text-signal-yellow' : 'text-gray-300'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export function ReviewDialog({ orderId, factoryName, onReviewSubmit }: ReviewDialogProps) {
  const t = useTranslations('Reviews');
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<ReviewData>({
    overall: 0,
    quality: 0,
    communication: 0,
    delivery: 0,
    comment: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onReviewSubmit) {
      onReviewSubmit(data);
    }
    setOpen(false);
    setData({ overall: 0, quality: 0, communication: 0, delivery: 0, comment: '' });
  };

  if (!open) {
    return (
      <button 
        onClick={() => setOpen(true)}
        className="bg-signal-yellow text-deep-tide px-4 py-2 rounded-lg font-medium hover:bg-signal-yellow/90 transition-colors"
      >
        {t('submitReview', { fallback: 'Submit Verified Review' })}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-[500px] overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-deep-tide mb-1">
            {t('reviewFactory', { fallback: 'Review' })}: {factoryName}
          </h2>
          <p className="text-sm text-steel">
            {t('onlyVerified', { fallback: 'Verified order' })} #{orderId}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-deep-tide">{t('overall', { fallback: 'Overall Experience' })}</label>
              <StarRating rating={data.overall} onChange={(r) => setData({ ...data, overall: r })} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-deep-tide">{t('quality', { fallback: 'Product Quality vs. Sample' })}</label>
              <StarRating rating={data.quality} onChange={(r) => setData({ ...data, quality: r })} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-deep-tide">{t('communication', { fallback: 'Factory Communication' })}</label>
              <StarRating rating={data.communication} onChange={(r) => setData({ ...data, communication: r })} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-deep-tide">{t('delivery', { fallback: 'On-time Delivery' })}</label>
              <StarRating rating={data.delivery} onChange={(r) => setData({ ...data, delivery: r })} />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium text-deep-tide">{t('comment', { fallback: 'Your Comment' })}</label>
            <textarea
              id="comment"
              placeholder={t('commentPlaceholder', { fallback: 'إيه رأيك في جودة المنتج والتعامل مع المصنع؟ (Your experience with the product quality and factory?)' })}
              value={data.comment}
              onChange={(e) => setData({ ...data, comment: e.target.value })}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-harbor-petrol"
            />
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button 
              type="button" 
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-steel hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              {t('cancel', { fallback: 'Cancel' })}
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-harbor-petrol text-white rounded-lg font-medium hover:bg-harbor-petrol/90 transition-colors"
            >
              {t('submit', { fallback: 'Submit Review' })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
