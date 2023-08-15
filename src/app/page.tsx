import Image from 'next/image';
import styles from './page.module.scss';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';

export default async function RootPage() {
  return (
    <>
      <Header />
    </>
  );
}
