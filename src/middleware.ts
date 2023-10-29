import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  if (!request.cookies.get('access_token')?.value) {
    const data = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:
        'grant_type=client_credentials&client_id=' +
        process.env.SPOTIFY_CLIENT_ID +
        '&client_secret=' +
        process.env.SPOTIFY_CLIENT_SECRET,
    }).then((res) => res.json());

    const response = NextResponse.next();

    response.cookies.set('access_token', data['access_token'], {
      maxAge: data['expires_in'],
      secure: true,
    });

    return response;
  }
}
