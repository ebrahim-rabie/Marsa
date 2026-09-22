import { createClient as createBrowserClient } from '@/lib/supabase/client';
import { createClient as createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient as createSupabaseAdminClient } from '@/lib/supabase/admin';
import type {
  Database,
  User,
  Company,
  Supplier,
  BuyRequest,
  Quote,
  Order,
  OrderStage,
  InspectionReport,
  OrderMessage,
  Review,
  Dispute,
  Payment,
  CustomsStatus,
  Json,
} from '@/types/database';

export * from '@/types/database';
export { createBrowserClient, createServerSupabaseClient, createSupabaseAdminClient };

// ==========================================
// 1. User & Company Repository
// ==========================================

export async function getUserProfile(userId: string): Promise<User | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;
  return data;
}

export async function createCompanyRecord(
  company: Database['public']['Tables']['companies']['Insert']
): Promise<Company | null> {
  const adminClient = createSupabaseAdminClient();
  const { data, error } = await adminClient
    .from('companies')
    .insert(company)
    .select('*')
    .single();

  if (error || !data) {
    console.error('Error creating company record:', error);
    return null;
  }
  return data;
}

export async function createUserRecord(
  user: Database['public']['Tables']['users']['Insert']
): Promise<User | null> {
  const adminClient = createSupabaseAdminClient();
  const { data, error } = await adminClient
    .from('users')
    .insert(user)
    .select('*')
    .single();

  if (error || !data) {
    console.error('Error creating user record:', error);
    return null;
  }
  return data;
}

// ==========================================
// 2. Buy Requests / RFQ Repository
// ==========================================

export async function createBuyRequestRecord(
  rfq: Database['public']['Tables']['buy_requests']['Insert']
): Promise<{ success: boolean; data?: BuyRequest; requestNumber?: string; error?: string }> {
  try {
    const adminClient = createSupabaseAdminClient();
    
    // Auto-generate human-readable RFQ number if omitted
    const requestNumber = rfq.request_number || `RFQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const payload = {
      ...rfq,
      request_number: requestNumber,
    };

    const { data, error } = await adminClient
      .from('buy_requests')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      console.error('Database error inserting buy request:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data, requestNumber };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown database error';
    return { success: false, error: message };
  }
}

export async function getBuyRequests(options?: {
  buyerId?: string;
  status?: string;
  limit?: number;
}): Promise<BuyRequest[]> {
  const supabase = await createServerSupabaseClient();
  let query = supabase.from('buy_requests').select('*');

  if (options?.buyerId) query = query.eq('buyer_id', options.buyerId);
  if (options?.status) query = query.eq('status', options.status as any);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

// ==========================================
// 3. Suppliers & Verification Repository
// ==========================================

export async function createSupplierRecord(
  supplier: Database['public']['Tables']['suppliers']['Insert']
): Promise<Supplier | null> {
  const adminClient = createSupabaseAdminClient();
  const { data, error } = await adminClient
    .from('suppliers')
    .insert(supplier)
    .select('*')
    .single();

  if (error || !data) {
    console.error('Error creating supplier record:', error);
    return null;
  }
  return data;
}

export async function getSuppliersList(options?: {
  activeOnly?: boolean;
  minLevel?: number;
  limit?: number;
}): Promise<Supplier[]> {
  const supabase = await createServerSupabaseClient();
  let query = supabase.from('suppliers').select('*');

  if (options?.activeOnly ?? true) query = query.eq('active', true);
  if (options?.minLevel) query = query.gte('verification_level', options.minLevel);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

export async function getSupplierById(id: string): Promise<Supplier | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

// ==========================================
// 4. Orders, Escrow & Stages Repository
// ==========================================

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .single();

  if (error || !data) return null;
  return data;
}

export async function updateOrderPaymentState(
  orderNumber: string,
  params: {
    depositPaid?: boolean;
    stage?: number;
    balanceReleased?: boolean;
  }
): Promise<boolean> {
  const adminClient = createSupabaseAdminClient();
  const updatePayload: Database['public']['Tables']['orders']['Update'] = {
    updated_at: new Date().toISOString(),
  };

  if (params.depositPaid !== undefined) updatePayload.deposit_paid = params.depositPaid;
  if (params.stage !== undefined) updatePayload.current_stage = params.stage;
  if (params.balanceReleased !== undefined) updatePayload.balance_released = params.balanceReleased;

  const { error } = await adminClient
    .from('orders')
    .update(updatePayload)
    .eq('order_number', orderNumber);

  if (error) {
    console.error('Error updating order payment state:', error);
    return false;
  }
  return true;
}

export async function updateOrderCustomsInfo(
  orderNumber: string,
  customsData: {
    acidNumber?: string;
    portOfEntry?: string;
    blNumber?: string;
    shippingCarrier?: string;
    customsStatus?: CustomsStatus;
    fxRatesSnapshot?: Json;
  }
): Promise<boolean> {
  const adminClient = createSupabaseAdminClient();
  const updatePayload: Database['public']['Tables']['orders']['Update'] = {
    updated_at: new Date().toISOString(),
  };

  if (customsData.acidNumber !== undefined) updatePayload.acid_number = customsData.acidNumber;
  if (customsData.portOfEntry !== undefined) updatePayload.port_of_entry = customsData.portOfEntry;
  if (customsData.blNumber !== undefined) updatePayload.bl_number = customsData.blNumber;
  if (customsData.shippingCarrier !== undefined) updatePayload.shipping_carrier = customsData.shippingCarrier;
  if (customsData.customsStatus !== undefined) updatePayload.customs_status = customsData.customsStatus;
  if (customsData.fxRatesSnapshot !== undefined) updatePayload.fx_rates_snapshot = customsData.fxRatesSnapshot;

  const { error } = await adminClient
    .from('orders')
    .update(updatePayload)
    .eq('order_number', orderNumber);

  if (error) {
    console.error('Error updating order customs info:', error);
    return false;
  }
  return true;
}

// ==========================================
// 5. Payments Repository
// ==========================================

export async function recordPaymentTransaction(
  payment: Database['public']['Tables']['payments']['Insert']
): Promise<Payment | null> {
  const adminClient = createSupabaseAdminClient();
  const { data, error } = await adminClient
    .from('payments')
    .insert(payment)
    .select('*')
    .single();

  if (error || !data) {
    console.error('Error recording payment transaction:', error);
    return null;
  }
  return data;
}

// ==========================================
// 6. Disputes Repository
// ==========================================

export async function createDisputeRecord(
  dispute: Database['public']['Tables']['disputes']['Insert']
): Promise<Dispute | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('disputes')
    .insert(dispute)
    .select('*')
    .single();

  if (error || !data) {
    console.error('Error creating dispute record:', error);
    return null;
  }
  return data;
}

export async function resolveDisputeRecord(
  orderId: string,
  resolution: string,
  status: 'resolved' = 'resolved'
): Promise<boolean> {
  const adminClient = createSupabaseAdminClient();
  const { error } = await adminClient
    .from('disputes')
    .update({
      resolution,
      status,
      resolved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('order_id', orderId);

  return !error;
}

// ==========================================
// 7. Reviews Repository
// ==========================================

export async function submitReviewRecord(
  review: Database['public']['Tables']['reviews']['Insert']
): Promise<Review | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select('*')
    .single();

  if (error || !data) {
    console.error('Error submitting review:', error);
    return null;
  }
  return data;
}

// ==========================================
// 8. Order Negotiation Messages Repository
// ==========================================

export async function getOrderMessages(orderId: string): Promise<OrderMessage[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('order_messages')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });

  if (error || !data) return [];
  return data;
}

export async function sendOrderMessage(
  message: Database['public']['Tables']['order_messages']['Insert']
): Promise<OrderMessage | null> {
  const adminClient = createSupabaseAdminClient();
  const { data, error } = await adminClient
    .from('order_messages')
    .insert(message)
    .select('*')
    .single();

  if (error || !data) {
    console.error('Error inserting order message:', error);
    return null;
  }
  return data;
}

// ==========================================
// 9. Maintenance / Keepalive
// ==========================================

export async function pingSupabaseKeepalive(): Promise<{
  success: boolean;
  rowsChecked: number;
  error?: string;
}> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { success: true, rowsChecked: 0 };
  }

  const adminClient = createSupabaseAdminClient();
  const { data, error } = await adminClient.from('companies').select('id').limit(1);

  if (error) {
    return { success: false, rowsChecked: 0, error: error.message };
  }

  return { success: true, rowsChecked: data?.length ?? 0 };
}
