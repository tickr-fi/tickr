import { NextRequest, NextResponse } from 'next/server';
import { premarketsController } from '@/lib/controllers';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10), 1), 100);
  const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);
  
  const result = await premarketsController.getAllPremarkets(limit, offset);
  
  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data: result.data,
    count: result.data?.length || 0,
    limit,
    offset
  });
}
