import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/database';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, businessName, phoneNumber, industry } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session identifier.' }, { status: 400 });
    }
    if (!businessName || !phoneNumber || !industry) {
      return NextResponse.json({ error: 'Missing required lead fields.' }, { status: 400 });
    }

    // 2. Persist lead details to Supabase via helper
    const result = await createLead({
      sessionId,
      businessName,
      phoneNumber,
      industry,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Sandbox Lead API Route Error:', error);
    return NextResponse.json(
      { error: 'Could not record lead.', details: error.message },
      { status: 500 }
    );
  }
}
