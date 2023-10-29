import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  return NextResponse.json(accessToken);
}
