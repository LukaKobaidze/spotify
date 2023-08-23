'use client';
import { fetchArtistAlbums } from '@/helpers/requests';
import styles from './page.module.scss';
import { useContext, useEffect, useState } from 'react';
import { SpotifyAccessContext } from '@/context/spotifyAccess.context';
import Header from '@/components/Header';
import Playlist from '@/components/Playlist';
import Link from 'next/link';
import Card from '@/components/Card';

interface Props {
  params: {
    id: string;
  };
}

export default function ArtistAlbumsPage({ params }: Props) {
  const { token } = useContext(SpotifyAccessContext);

  const [albums, setAlbums] = useState<any>();

  useEffect(() => {
    fetchArtistAlbums(token, params.id).then((data) => setAlbums(data));
  }, [token, params.id]);

  console.log(albums);
  return (
    <>
      <Header />
      <main>
        {albums && (
          <>
            <Link href={`/artist/${params.id}`} className={styles.headingAnchor}>
              <h1 className={styles.heading}>{albums.items[0].artists[0].name}</h1>
            </Link>
            <div className={styles.albumsGrid}>
              {albums.items.map((album: any) => (
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
                      subtitle={
                        album.release_date.slice(
                          0,
                          album.release_date.indexOf('-')
                        ) +
                        ' • ' +
                        album.artists[0].name
                      }
                    />
                  </Link>
                </Playlist>
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}
