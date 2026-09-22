'use server';

import { createBuyRequestRecord } from '@/lib/database';

export interface BuyRequestFormData {
  productName: string;
  category: string;
  specifications: string;
  quantity: string;
  unit: string;
  budgetMin?: string;
  budgetMax?: string;
  currency?: string;
  supplierPreference?: 'both' | 'egyptian' | 'chinese';
  deliveryDate?: string;
  notes?: string;
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  source?: string;
}

export async function insertBuyRequest(formData: BuyRequestFormData) {
  try {
    // In local sandbox / demo mode without Supabase credentials:
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const simulatedRfq = `RFQ-${Math.floor(1000 + Math.random() * 9000)}`;
      return { success: true, requestNumber: simulatedRfq };
    }

    const result = await createBuyRequestRecord({
      buyer_id: '00000000-0000-0000-0000-000000000000', // anonymous / public RFQ placeholder
      product_name: formData.productName,
      category: formData.category,
      specifications: { description: formData.specifications, notes: formData.notes },
      quantity: Number(formData.quantity) || 1,
      unit: formData.unit,
      budget_min: formData.budgetMin ? Number(formData.budgetMin) : null,
      budget_max: formData.budgetMax ? Number(formData.budgetMax) : null,
      budget_currency: formData.currency || 'USD',
      supplier_pref: (formData.supplierPreference as any) || 'both',
      delivery_date: formData.deliveryDate || null,
      notes: formData.notes || null,
      source: formData.source || null,
      status: 'pending',
    });

    if (!result.success) {
      return { success: false, error: result.error || 'Failed to submit buy request' };
    }

    return { success: true, requestNumber: result.requestNumber };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error in insertBuyRequest:', errorMsg);
    return { success: false, error: errorMsg };
  }
}
