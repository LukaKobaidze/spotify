import { cookies } from 'next/headers';
import {
  fetchArtist,
  fetchArtistAlbums,
  fetchArtistRelatedArtists,
  fetchArtistTopTracks,
} from '@/services/spotify';
import Header from '@/components/Header';
import TopTracks from './TopTracks';
import Rows from './Rows';
import Hero from './Hero';

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
    ? (await fetchArtistTopTracks(accessToken, params.id))?.tracks
    : null;
  const albums = accessToken
    ? await fetchArtistAlbums(accessToken, params.id)
    : null;
  const relatedArtists = accessToken
    ? (await fetchArtistRelatedArtists(accessToken, params.id))?.artists
    : null;

  return (
    <>
      <Header backgroundOpacity={0.55} />
      <main>
        {artistData && (
          <Hero
            name={artistData.name}
            image={artistData.images[1] || artistData.images[0]}
            totalFollowers={artistData.followers.total}
          />
        )}

        {artistData && topTracks && (
          <TopTracks artist={artistData} tracks={topTracks} />
        )}

        <Rows albums={albums} relatedArtists={relatedArtists} artistId={params.id} />
      </main>
    </>
  );
}
