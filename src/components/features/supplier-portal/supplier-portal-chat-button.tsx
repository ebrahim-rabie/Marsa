'use client';

import { useState } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderChatDrawer } from '@/components/features/chat/order-chat-drawer';

interface SupplierChatButtonProps {
  orderNumber: string;
  buyerName: string;
  locale: string;
}

export function SupplierChatButton({
  orderNumber,
  buyerName,
  locale,
}: SupplierChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isAr = locale === 'ar';

  return (
    <>
      <Button
        size="sm"
        onClick={() => setIsOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        <span>
          {isAr ? 'محادثة المشتري (ترجمة صينية فورية 🇨🇳)' : 'Chat with Buyer (AI Translation 🇨🇳)'}
        </span>
      </Button>

      <OrderChatDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        orderNumber={orderNumber}
        partnerName={buyerName}
        partnerRole="buyer"
        currentRole="supplier"
        locale={locale}
      />
    </>
  );
}
