import { cookies } from 'next/headers';
import { fetchPlaylist } from '@/services/spotify';
import Header from '@/components/Header';
import PlayerHeader from '@/components/PlayerHeader';
import styles from './page.module.scss';
import ConsoleLogToClient from '@/components/ConsoleLogToClient/ConsoleLogToClient';
import Tracks from '@/components/Tracks';
import AlbumPlaylistActions from '@/components/AlbumPlaylistTrackActions/AlbumPlaylistTrackActions';

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
      <ConsoleLogToClient data={data} />
      <Header />
      <main>
        {data && (
          <>
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
            <AlbumPlaylistActions data={data} />
          </>
        )}

        {tracksData && <Tracks data={tracksData} />}
      </main>
    </>
  );
}
