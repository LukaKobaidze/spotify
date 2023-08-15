import { NextResponse } from 'next/server';

const CLIENT_ID = 'f3e58dc6217f4b5cb8274757973e6d5a';
const CLIENT_SECRET = 'fe56bb5b471b492899be63e289ab9bb0';

export async function GET(req: Request) {
  const access = await fetch('https://accounts.spotify.com/api/token', {
    cache: 'no-store',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:
      'grant_type=client_credentials&client_id=' +
      CLIENT_ID +
      '&client_secret=' +
      CLIENT_SECRET,
  }).then((res) => res.json());

  return NextResponse.json(access);
}
