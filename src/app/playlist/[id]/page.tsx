import { cookies } from 'next/headers';
import { fetchPlaylist } from '@/services/spotify';
import Header from '@/components/Header';
import PlayerHeader from '@/components/PlayerHeader';
import Tracks from '@/components/Tracks';
import AlbumPlaylistTrackActions from '@/components/AlbumPlaylistTrackActions/AlbumPlaylistTrackActions';
import { getPlayerId } from '@/helpers';

interface Props {
  params: { id: string };
}

export default async function PlaylistPage({ params }: Props) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  const data = accessToken ? await fetchPlaylist(accessToken, params.id) : null;

  const tracksData = data?.tracks.items.map((track) => track.track);
  return (
    <>
      <Header backgroundAppearOnScroll />
      <main>
        {data && (
          <PlayerHeader
            image={data.images[0]}
            title={data.name}
            type="Playlist"
            subtitle={
              <>
                <span>{data.owner.display_name}</span>
                &nbsp;•&nbsp;
                <span>{data.tracks.total} songs</span>
              </>
            }
          />
        )}

        {tracksData && (
          <>
            <AlbumPlaylistTrackActions data={data!} trackList={tracksData} />
            <Tracks playerId={getPlayerId(data!)} data={tracksData} />
          </>
        )}
      </main>
    </>
  );
}
