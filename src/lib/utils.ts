import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DEAL_STAGES, VERIFICATION_LEVELS } from './constants';

export function formatCurrency(amount: number, currency: string = 'EGP', locale: string = 'ar-EG') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    numberingSystem: 'latn',
  }).format(amount);
}

export function formatEGP(amount: number, locale: string = 'ar-EG') {
  return formatCurrency(amount, 'EGP', locale);
}

export function formatUSD(amount: number, locale: string = 'en-US') {
  return formatCurrency(amount, 'USD', locale);
}

export function formatDate(date: Date | string, locale: string = 'ar-EG') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string, locale: string = 'ar-EG') {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const timeMs = new Date(date).getTime();
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);
  const cutoffs = [
    60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity
  ];
  const units: Intl.RelativeTimeFormatUnit[] = ["second", "minute", "hour", "day", "week", "month", "year"];
  
  const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds));
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
  
  return rtf.format(Math.round(deltaSeconds / divisor), units[unitIndex]);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-\u0600-\u06FF]+/g, '')
    .replace(/\-\-+/g, '-');
}

export function toPiasters(amount: number) {
  return Math.round(amount * 100);
}

export function fromPiasters(piasters: number) {
  return piasters / 100;
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getVerificationLabel(level: number, locale: string = 'ar') {
  const match = VERIFICATION_LEVELS.find((v) => v.level === level);
  if (!match) return '';
  return locale === 'ar' ? match.labelAr : match.labelEn;
}

export function getStageLabel(stage: number, locale: string = 'ar') {
  const match = DEAL_STAGES.find((s) => s.stage === stage);
  if (!match) return '';
  return locale === 'ar' ? match.labelAr : match.labelEn;
}

export function getDealStages() {
  return DEAL_STAGES;
}
