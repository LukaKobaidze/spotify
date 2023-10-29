import { cookies } from 'next/headers';
import Image from 'next/image';
import {
  fetchArtist,
  fetchArtistAlbums,
  fetchArtistRelatedArtists,
  fetchArtistTopTracks,
} from '@/services/spotify';
import Header from '@/components/Header';
import TopTracks from './TopTracks';
import Rows from './Rows';
import styles from './page.module.scss';

interface Props {
  params: {
    id: string;
  };
}

export default async function ArtistPage({ params }: Props) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  const artistData = accessToken ? await fetchArtist(accessToken, params.id) : null;
  const topTracks = accessToken
    ? (await fetchArtistTopTracks(accessToken, params.id)).tracks
    : null;
  const albums = accessToken
    ? await fetchArtistAlbums(accessToken, params.id)
    : null;
  const relatedArtists = accessToken
    ? (await fetchArtistRelatedArtists(accessToken, params.id)).artists
    : null;

  return (
    <>
      <Header className={styles.header} />
      <main>
        <div className={styles.bannerBackground} />
        {artistData && (
          <div className={styles.banner}>
            <div>
              <h1 className={styles.bannerHeading}>{artistData.name}</h1>
              <p className={styles.bannerFollowers}>
                {artistData.followers.total.toLocaleString()} followers
              </p>
            </div>

            {artistData.images && (
              <Image
                src={artistData.images[1].url}
                width={artistData.images[1].width}
                height={artistData.images[1].height}
                alt=""
                className={styles.bannerImage}
              />
            )}
          </div>
        )}

        {topTracks && <TopTracks data={topTracks} />}

        <Rows albums={albums} relatedArtists={relatedArtists} artistId={params.id} />
      </main>
    </>
  );
}
