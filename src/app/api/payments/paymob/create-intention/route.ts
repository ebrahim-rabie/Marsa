import { NextResponse } from 'next/server';
import { createPaymobIntention } from '@/lib/paymob';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderNumber, amountEgp, customer } = body;

    if (!orderNumber || !amountEgp || !customer?.phone) {
      return NextResponse.json(
        { error: 'Missing required fields: orderNumber, amountEgp, customer.phone' },
        { status: 400 }
      );
    }

    // In local sandbox / demo mode without live Paymob credentials:
    if (!process.env.PAYMOB_SECRET_KEY) {
      return NextResponse.json({
        mock: true,
        message: 'Paymob credentials not configured in sandbox. Simulated checkout successful.',
        checkoutUrl: `/ar/dashboard/orders/${orderNumber}?payment=simulated_success`,
      });
    }

    const intention = await createPaymobIntention({
      amountEgp,
      orderNumber,
      customer,
    });

    return NextResponse.json({
      success: true,
      clientSecret: intention.client_secret,
      id: intention.id,
      checkoutUrl: `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY || ''}&clientSecret=${intention.client_secret}`,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating Paymob payment intention:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
