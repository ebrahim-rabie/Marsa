export type CurrencyCode = 'USD' | 'EGP' | 'CNY';

export interface FXRateSnapshot {
  baseCurrency: CurrencyCode;
  rates: Record<CurrencyCode, number>;
  lockedAt: string;
  source: string;
}

// Current indicative benchmark rates (Egypt/China B2B trade corridor)
export const DEFAULT_FX_RATES: Record<CurrencyCode, number> = {
  USD: 1.0,
  EGP: 50.50, // 1 USD = 50.50 EGP
  CNY: 7.25,  // 1 USD = 7.25 CNY (Chinese Yuan)
};

export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  customRates: Record<CurrencyCode, number> = DEFAULT_FX_RATES
): number {
  if (from === to) return amount;
  // Convert from origin to USD, then from USD to target
  const amountInUsd = amount / customRates[from];
  const targetAmount = amountInUsd * customRates[to];
  return Math.round(targetAmount * 100) / 100;
}

export function formatCurrency(
  amount: number,
  currency: CurrencyCode,
  locale: string = 'ar'
): string {
  const isAr = locale === 'ar';
  const symbols: Record<CurrencyCode, { ar: string; en: string }> = {
    USD: { ar: 'دولار', en: 'USD' },
    EGP: { ar: 'ج.م', en: 'EGP' },
    CNY: { ar: 'يوان', en: 'CNY (¥)' },
  };

  const formattedNum = amount.toLocaleString(isAr ? 'ar-EG' : 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${formattedNum} ${symbols[currency][isAr ? 'ar' : 'en']}`;
}

export function getOrderFxSnapshot(orderTotalUsd: number): {
  usd: number;
  egp: number;
  cny: number;
  rates: Record<CurrencyCode, number>;
  lockedDate: string;
} {
  return {
    usd: orderTotalUsd,
    egp: convertCurrency(orderTotalUsd, 'USD', 'EGP'),
    cny: convertCurrency(orderTotalUsd, 'USD', 'CNY'),
    rates: DEFAULT_FX_RATES,
    lockedDate: new Date().toISOString().split('T')[0],
  };
}
