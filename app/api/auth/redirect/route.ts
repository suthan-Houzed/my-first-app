import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const { token } = await request.json();
  if (!token) {
    return NextResponse.json({ success: false, error: 'Token missing' }, { status: 400 });
  }
cookieStore.set('auth-token', token); 
return NextResponse.json({ success: true },{ status: 200 });
} 

