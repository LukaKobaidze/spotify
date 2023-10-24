import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  if (!request.cookies.has('access_token')) {
    const data = await fetch('https://accounts.spotify.com/api/token', {
      cache: 'no-store',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:
        'grant_type=client_credentials&client_id=' +
        process.env.CLIENT_ID +
        '&client_secret=' +
        process.env.CLIENT_SECRET,
    }).then((res) => res.json());

    const response = NextResponse.next();

    response.cookies.set('access_token', data['access_token'], {
      maxAge: data['expires_in'],
      secure: true,
    });

    return response;
  }
}
