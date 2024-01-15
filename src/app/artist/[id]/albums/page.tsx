import Link from 'next/link';
import { cookies } from 'next/headers';
import { fetchArtistAlbums } from '@/services/spotify';
import Header from '@/components/Header';
import ItemsGrid from '@/components/ItemsGrid';
import styles from './page.module.scss';
import PlayerCard from '@/components/PlayerCard';

interface Props {
  params: {
    id: string;
  };
}

export default async function ArtistAlbumsPage({ params }: Props) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  const albums = accessToken
    ? await fetchArtistAlbums(accessToken, params.id)
    : null;

  return (
    <>
      <Header />
      <main>
        {albums && (
          <>
            <Link href={`/artist/${params.id}`} className={styles.headingAnchor}>
              <h1 className={styles.heading}>{albums.items[0].artists[0].name}</h1>
            </Link>
            <ItemsGrid>
              {albums.items.map((album) => (
                <PlayerCard
                  key={album.id}
                  data={album}
                  description={
                    album.release_date.slice(0, album.release_date.indexOf('-')) +
                    ' • ' +
                    album.artists[0].name
                  }
                  customPos={{ bottom: 95 }}
                />
              ))}
            </ItemsGrid>
          </>
        )}
      </main>
    </>
  );
}
