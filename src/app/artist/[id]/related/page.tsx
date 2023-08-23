'use client';

import Header from '@/components/Header';
import { SpotifyAccessContext } from '@/context/spotifyAccess.context';
import { fetchArtistRelatedArtists } from '@/helpers/requests';
import { useContext, useEffect, useState } from 'react';
import styles from './page.module.scss';
import Playlist from '@/components/Playlist';
import Link from 'next/link';
import Card from '@/components/Card';

interface Props {
  params: {
    id: string;
  };
}

export default function ArtistRelatedPage({ params }: Props) {
  const { token } = useContext(SpotifyAccessContext);

  const [relatedArtists, setRelatedArtists] = useState<any>();

  useEffect(() => {
    fetchArtistRelatedArtists(token, params.id).then((data) =>
      setRelatedArtists(data.artists)
    );
  }, [token, params.id]);

  return (
    <>
      <Header />
      <main>
        <h1 className={styles.heading}>Fans also like</h1>
        {relatedArtists && (
          <div className={styles.artistsGrid}>
            {relatedArtists.map((album: any) => (
              <Playlist
                key={album.id}
                playerOffset={[24, 97]}
              >
                <Link href={'/album/' + album.id}>
                  <Card
                    image={{
                      src: album.images[1].url,
                      width: album.images[1].width,
                      height: album.images[1].height,
                    }}
                    title={album.name}
                    subtitle="Artist"
                    imageRounded
                  />
                </Link>
              </Playlist>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
