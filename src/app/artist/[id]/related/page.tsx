import { cookies } from 'next/headers';
import Link from 'next/link';
import { fetchArtistRelatedArtists } from '@/services/spotify';
import Header from '@/components/Header';
import ItemsGrid from '@/components/ItemsGrid';
import ItemPlayer from '@/components/ItemPlayer';
import Card from '@/components/Card';
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
    ? (await fetchArtistRelatedArtists(accessToken, params.id)).artists
    : null;

  return (
    <>
      <Header />
      <main>
        <h1 className={styles.heading}>Fans also like</h1>
        {relatedArtists && (
          <ItemsGrid>
            {relatedArtists.map((album) => (
              <ItemPlayer key={album.id}>
                <Link href={'/artist/' + album.id}>
                  <Card data={album} subtitle="Artist" imageRounded />
                </Link>
              </ItemPlayer>
            ))}
          </ItemsGrid>
        )}
      </main>
    </>
  );
}
