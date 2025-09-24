import { NextRequest, NextResponse } from 'next/server';
import { marketsController } from '@/lib/controllers';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50', 10), 1), 100);
  
  const result = await marketsController.getAllMarkets(limit);
  
  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data: result.data,
    count: result.data?.length || 0,
    limit
  });
}
