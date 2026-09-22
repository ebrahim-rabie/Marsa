export const DEAL_STAGES = [
  { stage: 1, labelEn: 'Quote Accepted', labelAr: 'تم قبول العرض', icon: 'CheckCircle' },
  { stage: 2, labelEn: 'Payment Escrowed', labelAr: 'الدفعة في الضمان', icon: 'ShieldCheck' },
  { stage: 3, labelEn: 'Production/Prep', labelAr: 'الإنتاج / التجهيز', icon: 'Settings' },
  { stage: 4, labelEn: 'Pre-shipment Inspection', labelAr: 'فحص ما قبل الشحن', icon: 'ClipboardCheck' },
  { stage: 5, labelEn: 'Shipped', labelAr: 'تم الشحن', icon: 'Truck' },
  { stage: 6, labelEn: 'Delivered', labelAr: 'تم التوصيل', icon: 'Package' },
  { stage: 7, labelEn: 'Completed/Funds Released', labelAr: 'مكتمل / تم تحرير الأموال', icon: 'Banknotes' },
];

export const CATEGORIES = [
  { id: 'packaging', labelEn: 'Packaging', labelAr: 'تعبئة وتغليف' },
  { id: 'lighting', labelEn: 'Lighting', labelAr: 'إضاءة' },
  { id: 'spare_parts', labelEn: 'Spare Parts', labelAr: 'قطع غيار' },
  { id: 'electrical', labelEn: 'Electrical', labelAr: 'كهربائيات' },
  { id: 'textiles', labelEn: 'Textiles', labelAr: 'منسوجات' },
  { id: 'raw_materials', labelEn: 'Raw Materials', labelAr: 'مواد خام' },
  { id: 'other', labelEn: 'Other', labelAr: 'أخرى' },
];

export const VERIFICATION_LEVELS = [
  { level: 0, labelEn: 'Unverified', labelAr: 'غير موثق' },
  { level: 1, labelEn: 'Basic', labelAr: 'أساسي' },
  { level: 2, labelEn: 'Verified', labelAr: 'موثق' },
  { level: 3, labelEn: 'Premium', labelAr: 'مميز' },
];

export const ORDER_STATUSES = ['active', 'completed', 'disputed', 'cancelled'] as const;

export const REQUEST_STATUSES = [
  'pending',
  'sourcing',
  'quotes_ready',
  'buyer_reviewing',
  'accepted',
  'expired',
  'cancelled',
] as const;

export const QUOTE_STATUSES = ['pending', 'accepted', 'rejected', 'expired'] as const;

export const DISPUTE_TYPES = ['quality', 'delay', 'damage', 'other'] as const;

export const DOCUMENT_TYPES = ['invoice', 'receipt', 'contract', 'inspection', 'other'] as const;

export const PAYMENT_TYPES = ['escrow', 'direct', 'milestone'] as const;

export const CURRENCIES = ['EGP', 'USD', 'SAR', 'AED'] as const;

export const SUPPLIER_PREFERENCES = ['local', 'international', 'verified_only'] as const;

export const INCOTERMS = ['EXW', 'FOB', 'CIF', 'DDP'] as const;

export const COMMISSION_RATE = 3; // 3%

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const COLORS = {
  primary: '#0F4C5C',
  accent: '#F2B01E',
  dark: '#0A2F38',
  background: '#F3F7F6',
  secondary: '#465A60',
  success: '#1B7A50',
  error: '#B42318',
};
