import Image from 'next/image';
import styles from './page.module.scss';
import { useEffect, useState } from 'react';

const CLIENT_ID = 'f3e58dc6217f4b5cb8274757973e6d5a';
const CLIENT_SECRET = 'fe56bb5b471b492899be63e289ab9bb0';

export default async function Home() {
  const accessToken = (
    await fetch('https://accounts.spotify.com/api/token', {
      cache: 'no-store',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:
        'grant_type=client_credentials&client_id=' +
        CLIENT_ID +
        '&client_secret=' +
        CLIENT_SECRET,
    }).then((res) => res.json())
  )['access_token'];

  return <div>{}</div>;
}
