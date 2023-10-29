'use client';
import { useRouter } from 'next/navigation';

interface Props {
  accessToken: string | undefined;
}

export default function VerifyAuth({ accessToken }: Props) {
  const router = useRouter();

  if (!accessToken) {
    router.refresh();
  }

  return null;
}
