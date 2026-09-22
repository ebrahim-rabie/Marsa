'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { 
  X, Send, Languages, Sparkles, MessageSquare, 
  Paperclip, Building2, User, CheckCheck, Globe2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { ChatMessage, LanguageCode, UserRole } from '@/types/chat';
import { QUICK_TRADE_REPLIES, translateTradeMessage } from '@/lib/translation';

interface OrderChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  partnerName: string;
  partnerRole?: 'supplier' | 'buyer';
  currentRole?: UserRole;
  locale: string;
}

const INITIAL_DEMO_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    orderId: 'ORD-0042',
    senderId: 'buyer-01',
    senderName: 'أحمد حسن (مستورد مصري)',
    senderRole: 'buyer',
    originalText: 'هل يمكن توفير عينات للمعاينة قبل بدء الإنتاج الفعلي؟',
    translatedText: '在正式批量生产前能否寄送样品供我们确认？',
    sourceLanguage: 'ar',
    targetLanguage: 'zh',
    createdAt: '10:30 AM',
  },
  {
    id: 'msg-2',
    orderId: 'ORD-0042',
    senderId: 'supp-01',
    senderName: 'Shanghai Packaging Co. (مصنع شنغهاي)',
    senderRole: 'supplier',
    originalText: '没问题，我们今天就可以安排寄送产前样品，预计3-4天送达开罗。',
    translatedText: 'لا توجد مشكلة، يمكننا ترتيب إرسال عينات ما قبل الإنتاج اليوم، ومن المتوقع وصولها إلى القاهرة خلال 3-4 أيام.',
    sourceLanguage: 'zh',
    targetLanguage: 'ar',
    createdAt: '10:35 AM',
  },
  {
    id: 'msg-3',
    orderId: 'ORD-0042',
    senderId: 'buyer-01',
    senderName: 'أحمد حسن (مستورد مصري)',
    senderRole: 'buyer',
    originalText: 'تم إيداع دفعة الضمان المشروط (30%) بنجاح في حساب مرسى الآمن.',
    translatedText: '30%首期托管保证金已成功存入Marsa安全监管账户。',
    sourceLanguage: 'ar',
    targetLanguage: 'zh',
    createdAt: '11:15 AM',
  },
];

export function OrderChatDrawer({
  isOpen,
  onClose,
  orderNumber,
  partnerName,
  partnerRole = 'supplier',
  currentRole = 'buyer',
  locale,
}: OrderChatDrawerProps) {
  const isArabic = locale === 'ar';
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_DEMO_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslatedMap, setShowTranslatedMap] = useState<Record<string, boolean>>({
    'msg-1': true,
    'msg-2': true,
    'msg-3': true,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const toggleTranslate = (msgId: string) => {
    setShowTranslatedMap(prev => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    setIsTranslating(true);
    setInputText('');

    const sourceLang: LanguageCode = currentRole === 'buyer' ? 'ar' : 'zh';
    const targetLang: LanguageCode = currentRole === 'buyer' ? 'zh' : 'ar';

    // Auto-translate
    const { translatedText } = await translateTradeMessage({
      text,
      sourceLang,
      targetLang,
    });

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      orderId: orderNumber,
      senderId: currentRole === 'buyer' ? 'buyer-me' : 'supplier-me',
      senderName: currentRole === 'buyer' 
        ? (isArabic ? 'أنا (المشتري)' : 'Me (Buyer)') 
        : (isArabic ? 'أنا (المصنع)' : 'Me (Factory)'),
      senderRole: currentRole,
      originalText: text,
      translatedText,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    setShowTranslatedMap(prev => ({ ...prev, [newMsg.id]: true }));
    setIsTranslating(false);

    // Simulate smart partner response in demo mode after 2 seconds
    if (currentRole === 'buyer') {
      setTimeout(async () => {
        const factoryReplyZh = '收到您的确认，我们正在按照既定技术规格与ACID要求推进生产！';
        const { translatedText: factoryReplyAr } = await translateTradeMessage({
          text: factoryReplyZh,
          sourceLang: 'zh',
          targetLang: 'ar',
        });

        const replyMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          orderId: orderNumber,
          senderId: 'partner-sim',
          senderName: partnerName,
          senderRole: 'supplier',
          originalText: factoryReplyZh,
          translatedText: factoryReplyAr || 'تم استلام تأكيدكم وجارٍ تنفيذ الطلب ومطابقة مواصفات ACID الجمركية بدقة!',
          sourceLanguage: 'zh',
          targetLanguage: 'ar',
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, replyMsg]);
        setShowTranslatedMap(prev => ({ ...prev, [replyMsg.id]: true }));
      }, 1600);
    }
  };

  const handleQuickReply = (templateText: string) => {
    handleSendMessage(templateText);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={cn(
          "w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-s border-slate-200 dark:border-slate-800 transition-transform duration-300",
          isArabic ? "font-cairo" : ""
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              {partnerRole === 'supplier' ? <Building2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {partnerName}
                </h3>
                <span className="text-[11px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                  {orderNumber}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {isArabic 
                    ? 'ترجمة فورية ذكية (عربي 🇪🇬 ⟷ صيني 🇨🇳)' 
                    : 'Smart Instant Translation (AR 🇪🇬 ⟷ ZH 🇨🇳)'}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Translation Banner */}
        <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-slate-800/40 border-b border-blue-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-blue-900 dark:text-blue-300">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              {isArabic 
                ? 'اكتب بالعربية وسيتم ترجمة رسائلك تلقائياً للمصنع بالصينية' 
                : 'Type in English/Arabic, automatically translated to Chinese for the factory'}
            </span>
          </div>
          <span className="text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 px-1.5 py-0.5 rounded font-mono">
            LIVE AI
          </span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isMe = msg.senderRole === currentRole;
            const isTranslatedShown = showTranslatedMap[msg.id];

            return (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col max-w-[85%] space-y-1.5",
                  isMe ? "ms-auto items-end" : "me-auto items-start"
                )}
              >
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 px-1">
                  <span>{msg.senderName}</span>
                  <span>•</span>
                  <span>{msg.createdAt}</span>
                </div>

                <div
                  className={cn(
                    "p-3.5 rounded-2xl text-sm shadow-sm relative group",
                    isMe
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none border border-slate-200 dark:border-slate-700"
                  )}
                >
                  {/* Primary text shown */}
                  <p className="leading-relaxed">
                    {isTranslatedShown && msg.translatedText 
                      ? msg.translatedText 
                      : msg.originalText}
                  </p>

                  {/* Secondary/Original text collapse */}
                  {msg.translatedText && (
                    <div className={cn(
                      "mt-2 pt-2 border-t text-xs opacity-90",
                      isMe ? "border-emerald-500/50 text-emerald-100" : "border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                    )}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="italic font-sans text-[11px]">
                          {isTranslatedShown ? `[الأصل: ${msg.originalText}]` : `[مترجم: ${msg.translatedText}]`}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleTranslate(msg.id)}
                          className={cn(
                            "text-[10px] font-semibold underline hover:opacity-80 shrink-0",
                            isMe ? "text-white" : "text-emerald-600 dark:text-emerald-400"
                          )}
                        >
                          {isTranslatedShown 
                            ? (isArabic ? 'إظهار الأصل' : 'Show Original') 
                            : (isArabic ? 'إظهار الترجمة' : 'Show Translation')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {isMe && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 px-1">
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{isArabic ? 'تم التسليم والترجمة' : 'Delivered & Translated'}</span>
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Trade Reply Chips */}
        <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <p className="text-[11px] text-slate-500 font-medium px-2 mb-1.5">
            {isArabic ? 'قوالب مفاوضات سريعة (ترجمة تلقائية للصينية):' : 'Quick Trade Phrases (Auto-translated to Chinese):'}
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {QUICK_TRADE_REPLIES.map((reply) => (
              <button
                key={reply.id}
                type="button"
                onClick={() => handleQuickReply(isArabic ? reply.textAr : reply.textEn)}
                className="shrink-0 text-xs px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 rounded-full transition-all text-slate-700 dark:text-slate-300 whitespace-nowrap"
              >
                {isArabic ? reply.labelAr : reply.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Box */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 p-2"
            title={isArabic ? 'إرفاق ملف أو صورة عينة' : 'Attach file or sample image'}
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={isArabic ? 'اكتب رسالتك للتفاوض مع المصنع...' : 'Type message to negotiate with factory...'}
            className="flex-1 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500"
            disabled={isTranslating}
          />

          <Button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isTranslating}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
          >
            <Send className={cn("w-4 h-4", isArabic && "rotate-180")} />
          </Button>
        </div>
      </div>
    </div>
  );
}
