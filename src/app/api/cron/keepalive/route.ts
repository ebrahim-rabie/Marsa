import { NextResponse } from 'next/server';
import { pingSupabaseKeepalive } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ 
        status: 'skipped', 
        message: 'Supabase credentials not configured yet' 
      });
    }

    const result = await pingSupabaseKeepalive();

    if (!result.success) {
      return NextResponse.json({ status: 'error', error: result.error }, { status: 500 });
    }

    return NextResponse.json({ 
      status: 'ok', 
      message: 'Supabase keepalive ping successful',
      timestamp: new Date().toISOString(),
      rowsChecked: result.rowsChecked
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ status: 'error', message: errorMsg }, { status: 500 });
  }
}
