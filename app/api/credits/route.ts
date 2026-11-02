// app/api/credits/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    credits: 100,
    tier: 'Founder Pro',
    dailyAllowance: 50,
    renewalDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    features: ['Unlimited Apex Vision', '4K Upscaling', 'Studio V1 Cinema Access', 'API Access'],
  });
}

export async function POST(req: NextRequest) {
  try {
    const { amount = 50 } = await req.json();
    return NextResponse.json({
      success: true,
      added: amount,
      message: `Successfully topped up ${amount} credits to your Atomic Apex Studio account.`,
      newBalance: 150,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
