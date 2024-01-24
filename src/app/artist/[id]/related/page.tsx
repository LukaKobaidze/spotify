import { cookies } from 'next/headers';
import { fetchArtistRelatedArtists } from '@/services/spotify';
import Header from '@/components/Header';
import ItemsGrid from '@/components/ItemsGrid';
import PlayerCard from '@/components/PlayerCard';
import styles from './page.module.scss';

interface Props {
  params: {
    id: string;
  };
}

export default async function ArtistRelatedPage({ params }: Props) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  const relatedArtists = accessToken
    ? (await fetchArtistRelatedArtists(accessToken, params.id))?.artists
    : null;

  return (
    <>
      <Header />
      <main>
        <h1 className={styles.heading}>Fans also like</h1>
        {relatedArtists && (
          <ItemsGrid>
            {relatedArtists.map((album) => (
              <PlayerCard
                key={album.id}
                data={album}
                customPos={{ bottom: 80 }}
                imageRounded
              />
            ))}
          </ItemsGrid>
        )}
      </main>
    </>
  );
}
