import crypto from 'crypto';

interface PaymobCustomer {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
}

interface CreateIntentionParams {
  amountEgp: number; // in EGP
  orderNumber: string;
  customer: PaymobCustomer;
  items?: Array<{ name: string; amountEgp: number; quantity: number }>;
}

export interface PaymobIntentionResponse {
  client_secret: string;
  id: string;
  payment_keys?: Array<{ key: string }>;
}

/**
 * Creates a modern Payment Intention with Paymob Egypt API.
 * Amounts are strictly converted to piasters (1 EGP = 100 piasters).
 */
export async function createPaymobIntention({
  amountEgp,
  orderNumber,
  customer,
  items,
}: CreateIntentionParams): Promise<PaymobIntentionResponse> {
  const secretKey = process.env.PAYMOB_SECRET_KEY;
  if (!secretKey) {
    throw new Error('PAYMOB_SECRET_KEY is not configured');
  }

  // Paymob amounts MUST be in piasters (smallest currency unit)
  const amountInPiasters = Math.round(amountEgp * 100);

  const formattedItems = items?.map((item) => ({
    name: item.name,
    amount: Math.round(item.amountEgp * 100),
    quantity: item.quantity,
  })) || [
    {
      name: `Deposit for Order ${orderNumber}`,
      amount: amountInPiasters,
      quantity: 1,
    },
  ];

  const payload = {
    amount: amountInPiasters,
    currency: 'EGP',
    payment_methods: [
      // Cards (Visa, Mastercard, Meeza) and Mobile Wallets (Vodafone Cash, etc.)
      ...(process.env.PAYMOB_CARD_INTEGRATION_ID ? [Number(process.env.PAYMOB_CARD_INTEGRATION_ID)] : []),
      ...(process.env.PAYMOB_WALLET_INTEGRATION_ID ? [Number(process.env.PAYMOB_WALLET_INTEGRATION_ID)] : []),
    ],
    items: formattedItems,
    billing_data: {
      first_name: customer.firstName || 'Buyer',
      last_name: customer.lastName || 'Marsa',
      email: customer.email || 'support@marsa.trade',
      phone_number: customer.phone,
      country: 'EGY',
    },
    special_reference: orderNumber,
    notification_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://marsa.trade'}/api/webhooks/paymob`,
    redirection_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://marsa.trade'}/ar/dashboard/orders/${orderNumber}?payment=success`,
  };

  const response = await fetch('https://accept.paymob.com/v1/intention/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Paymob Intention creation failed: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Verifies Paymob Webhook HMAC SHA512 signature.
 * Ensures the callback authenticity and prevents man-in-the-middle tampering.
 */
export function verifyPaymobHmac(
  obj: Record<string, any>,
  receivedHmac: string
): boolean {
  const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
  if (!hmacSecret) {
    console.warn('PAYMOB_HMAC_SECRET not configured, skipping HMAC verification in sandbox');
    return true;
  }

  // Paymob HMAC verification uses specific concatenated fields in strict alphabetical order:
  const fields = [
    obj.amount_cents,
    obj.created_at,
    obj.currency,
    obj.error_occured,
    obj.has_parent_transaction,
    obj.id,
    obj.integration_id,
    obj.is_3d_secure,
    obj.is_auth,
    obj.is_capture,
    obj.is_refunded,
    obj.is_standalone_payment,
    obj.is_voided,
    obj.order?.id,
    obj.owner,
    obj.pending,
    obj.source_data?.pan,
    obj.source_data?.sub_type,
    obj.source_data?.type,
    obj.success,
  ];

  const concatenatedString = fields.map((v) => (v === undefined || v === null ? '' : String(v))).join('');

  const calculatedHmac = crypto
    .createHmac('sha512', hmacSecret)
    .update(concatenatedString)
    .digest('hex');

  return calculatedHmac.toLowerCase() === receivedHmac.toLowerCase();
}
