'use client';
import { useContext, useEffect, useState } from 'react';
import { fetchArtist } from '@/helpers/requests';
import { SpotifyAccessContext } from '@/context/spotifyAccess.context';
import styles from './page.module.scss';

interface Props {
  params: {
    id: string;
  };
}

export default function ArtistPage({ params }: Props) {
  const { token } = useContext(SpotifyAccessContext);

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchArtist(token, params.id).then((resData) => setData(resData));
  }, [token, params.id]);

  return <>{JSON.stringify(data)}</>;
}
