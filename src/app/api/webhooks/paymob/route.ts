import { NextResponse } from 'next/server';
import { verifyPaymobHmac } from '@/lib/paymob';
import { updateOrderPaymentState, recordPaymentTransaction, getOrderByNumber } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const receivedHmac = searchParams.get('hmac') || '';

    const body = await request.json();
    const transaction = body.obj;

    if (!transaction) {
      return NextResponse.json({ error: 'Invalid callback payload' }, { status: 400 });
    }

    // Verify HMAC-SHA512
    const isValid = verifyPaymobHmac(transaction, receivedHmac);
    if (!isValid) {
      console.error('Invalid Paymob HMAC signature received');
      return NextResponse.json({ error: 'HMAC verification failed' }, { status: 401 });
    }

    const isSuccess = transaction.success === true;
    const orderNumber = transaction.order?.merchant_order_id || transaction.special_reference;
    const amountCents = transaction.amount_cents;
    const amountEgp = amountCents ? amountCents / 100 : 0;
    const transactionId = String(transaction.id);

    console.log(`Paymob callback for Order: ${orderNumber}, Success: ${isSuccess}, Amount: ${amountEgp} EGP`);

    if (isSuccess && orderNumber && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // 1. Advance order stage to 4 (In production) & mark deposit as paid
      await updateOrderPaymentState(orderNumber, {
        depositPaid: true,
        stage: 4,
      });

      // 2. Lookup order ID to link payment record
      const order = await getOrderByNumber(orderNumber);

      // 3. Record completed payment transaction
      await recordPaymentTransaction({
        order_id: order?.id || '00000000-0000-0000-0000-000000000000',
        amount: amountEgp,
        currency: 'EGP',
        type: 'deposit',
        status: 'completed',
        method: transaction.source_data?.type || 'card',
        reference: transactionId,
        paid_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ status: 'received', verified: true });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing Paymob webhook:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
