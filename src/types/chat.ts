export type LanguageCode = 'ar' | 'zh' | 'en';

export type UserRole = 'buyer' | 'supplier' | 'admin';

export interface ChatAttachment {
  id: string;
  name: string;
  url: string;
  sizeBytes?: number;
  type: 'image' | 'pdf' | 'document';
}

export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  originalText: string;
  translatedText?: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  isTranslated?: boolean;
  createdAt: string;
  attachments?: ChatAttachment[];
}

export interface QuickReplyTemplate {
  id: string;
  labelAr: string;
  labelEn: string;
  labelZh: string;
  textAr: string;
  textEn: string;
  textZh: string;
}
