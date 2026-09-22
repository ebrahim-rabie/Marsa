import type { LanguageCode, QuickReplyTemplate } from '@/types/chat';

// B2B Trade Terminology Dictionary for Arabic, Chinese, and English
const TRADE_DICTIONARY: Record<string, { ar: string; zh: string; en: string }> = {
  samples: {
    ar: 'هل يمكن توفير عينات للمعاينة قبل بدء الإنتاج الفعلي؟',
    zh: '在正式批量生产前能否寄送样品供我们确认？',
    en: 'Can you provide pre-production samples for verification?',
  },
  moq: {
    ar: 'ما هو الحد الأدنى للطلب (MOQ) وهل متاح تخفيض للكميات الكبيرة؟',
    zh: '请问最低起订量(MOQ)是多少？大批量是否有阶梯价格？',
    en: 'What is the MOQ, and do you offer volume discounts?',
  },
  lead_time: {
    ar: 'كم يوماً تستغرق عملية التصنيع والتعبئة حتى جاهزية الشحن؟',
    zh: '从确认订单到完成生产并准备发货需要多少天？',
    en: 'How many days will manufacturing and packaging take until ready for shipment?',
  },
  fob_terms: {
    ar: 'هل السعر المعروض يشمل شرط التسليم FOB مع الشحن لميناء شنغهاي/نينغبو؟',
    zh: '请确认此报价是否基于上海/宁波港的FOB条款？',
    en: 'Does this quote reflect FOB delivery terms to Shanghai/Ningbo port?',
  },
  escrow_deposited: {
    ar: 'تم إيداع دفعة الضمان المشروط (30%) بنجاح في حساب مرسى الآمن.',
    zh: '30%首期托管保证金已成功存入Marsa安全监管账户。',
    en: 'The 30% escrow deposit has been successfully funded into Marsa secure account.',
  },
  inspection_ready: {
    ar: 'انتهت مرحلة الإنتاج والبضاعة جاهزة الآن لفحص الجودة والتفتيش الميداني.',
    zh: '批量生产已完成，货物已备妥，随时欢迎进行产地验货。',
    en: 'Production is complete and goods are ready for pre-shipment quality inspection.',
  },
  acid_requested: {
    ar: 'يرجى تزويدنا برقم التسجيل المسبق للشحنات (ACID) والفاتورة المبدئية للبنوك المصرية.',
    zh: '请向我们提供埃及海关ACID预申报编号以及形式发票(PI)。',
    en: 'Please provide the Egyptian customs ACID clearance number and Proforma Invoice.',
  },
  bl_issued: {
    ar: 'تم إصدار بوليصة الشحن (B/L) وإدراج الحاوية على الخط الملاحي بنجاح.',
    zh: '正本海运提单(B/L)已签发，集装箱已按计划配载上船。',
    en: 'Bill of Lading (B/L) has been issued and the container is loaded onto the vessel.',
  },
};

export const QUICK_TRADE_REPLIES: QuickReplyTemplate[] = [
  {
    id: 'samples',
    labelAr: '🔬 طلب عينات للفحص',
    labelEn: '🔬 Request Samples',
    labelZh: '🔬 索取样品',
    textAr: TRADE_DICTIONARY.samples.ar,
    textEn: TRADE_DICTIONARY.samples.en,
    textZh: TRADE_DICTIONARY.samples.zh,
  },
  {
    id: 'moq',
    labelAr: '📦 استفسار عن أقل كمية (MOQ)',
    labelEn: '📦 Inquire MOQ & Discount',
    labelZh: '📦 咨询起订量及阶梯价',
    textAr: TRADE_DICTIONARY.moq.ar,
    textEn: TRADE_DICTIONARY.moq.en,
    textZh: TRADE_DICTIONARY.moq.zh,
  },
  {
    id: 'lead_time',
    labelAr: '⏱️ الاستفسار عن مدة التصنيع',
    labelEn: '⏱️ Inquire Lead Time',
    labelZh: '⏱️ 询问交货期',
    textAr: TRADE_DICTIONARY.lead_time.ar,
    textEn: TRADE_DICTIONARY.lead_time.en,
    textZh: TRADE_DICTIONARY.lead_time.zh,
  },
  {
    id: 'fob_terms',
    labelAr: '🚢 شرط التسليم FOB',
    labelEn: '🚢 Confirm FOB Terms',
    labelZh: '🚢 确认FOB交货条款',
    textAr: TRADE_DICTIONARY.fob_terms.ar,
    textEn: TRADE_DICTIONARY.fob_terms.en,
    textZh: TRADE_DICTIONARY.fob_terms.zh,
  },
  {
    id: 'escrow_deposited',
    labelAr: '🛡️ تأكيد إيداع الضمان المشروط',
    labelEn: '🛡️ Escrow Deposit Funded',
    labelZh: '🛡️ 告知定金已托管',
    textAr: TRADE_DICTIONARY.escrow_deposited.ar,
    textEn: TRADE_DICTIONARY.escrow_deposited.en,
    textZh: TRADE_DICTIONARY.escrow_deposited.zh,
  },
  {
    id: 'acid_requested',
    labelAr: '📋 طلب رقم ACID الجمركي',
    labelEn: '📋 Request ACID Clearance',
    labelZh: '📋 请求埃及ACID清关号',
    textAr: TRADE_DICTIONARY.acid_requested.ar,
    textEn: TRADE_DICTIONARY.acid_requested.en,
    textZh: TRADE_DICTIONARY.acid_requested.zh,
  },
];

export async function translateTradeMessage(params: {
  text: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
}): Promise<{ translatedText: string; provider: string }> {
  const { text, sourceLang, targetLang } = params;

  if (sourceLang === targetLang || !text.trim()) {
    return { translatedText: text, provider: 'identity' };
  }

  // 1. Check exact match in trade dictionary
  for (const entry of Object.values(TRADE_DICTIONARY)) {
    if (entry[sourceLang].trim().toLowerCase() === text.trim().toLowerCase()) {
      return { translatedText: entry[targetLang], provider: 'trade_dictionary' };
    }
  }

  // 2. Keyword-based trade semantic translation fallback
  const lower = text.toLowerCase();
  if (lower.includes('عينة') || lower.includes('sample') || lower.includes('样品')) {
    return { translatedText: TRADE_DICTIONARY.samples[targetLang], provider: 'semantic_trade_model' };
  }
  if (lower.includes('moq') || lower.includes('كمية') || lower.includes('起订量')) {
    return { translatedText: TRADE_DICTIONARY.moq[targetLang], provider: 'semantic_trade_model' };
  }
  if (lower.includes('مدة') || lower.includes('lead time') || lower.includes('days') || lower.includes('交货')) {
    return { translatedText: TRADE_DICTIONARY.lead_time[targetLang], provider: 'semantic_trade_model' };
  }
  if (lower.includes('fob') || lower.includes('cif') || lower.includes('شحن') || lower.includes('条款')) {
    return { translatedText: TRADE_DICTIONARY.fob_terms[targetLang], provider: 'semantic_trade_model' };
  }
  if (lower.includes('acid') || lower.includes('جمارك') || lower.includes('customs') || lower.includes('清关')) {
    return { translatedText: TRADE_DICTIONARY.acid_requested[targetLang], provider: 'semantic_trade_model' };
  }
  if (lower.includes('ضمان') || lower.includes('escrow') || lower.includes('deposit') || lower.includes('定金')) {
    return { translatedText: TRADE_DICTIONARY.escrow_deposited[targetLang], provider: 'semantic_trade_model' };
  }

  // 3. Fallback generic translation tag format
  if (targetLang === 'zh') {
    return {
      translatedText: `[来自买家的贸易信息]: ${text} (如需商务确认请查看英/阿原文)`,
      provider: 'trade_bridge_zh',
    };
  } else if (targetLang === 'ar') {
    return {
      translatedText: `[رسالة تجارية واردة من المصنع]: ${text} (يمكن مراجعة النص الصيني/الإنجليزي الأصلي أدناه)`,
      provider: 'trade_bridge_ar',
    };
  } else {
    return {
      translatedText: `[Trade message]: ${text}`,
      provider: 'trade_bridge_en',
    };
  }
}
