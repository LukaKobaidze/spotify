import { cookies } from 'next/headers';
import { fetchAlbum, fetchArtist } from '@/services/spotify';
import { getAlbumReleaseYear, msToTimeFormatted } from '@/helpers/time';
import Header from '@/components/Header';
import PlayerHeader from '@/components/PlayerHeader';
import Tracks from '@/components/Tracks';
import AlbumPlaylistActions from '@/components/AlbumPlaylistTrackActions';
import Tooltip from '@/components/Tooltip';
import styles from './page.module.scss';

interface Props {
  params: {
    id: string;
  };
}

export default async function AlbumPage({ params }: Props) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  const albumData = accessToken ? await fetchAlbum(accessToken, params.id) : null;
  const artistData = albumData
    ? await fetchArtist(accessToken!, albumData.artists[0].id)
    : null;

  return (
    <>
      <Header backgroundOpacity={0.55} />
      <main>
        {albumData && artistData && (
          <PlayerHeader
            image={albumData.images[1]}
            title={albumData.name}
            type="Album"
            artist={artistData}
            subtitle={
              <>
                &nbsp;•&nbsp;
                <Tooltip
                  text={new Date(albumData.release_date).toLocaleDateString(
                    'en-us',
                    {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    }
                  )}
                  position="top"
                >
                  <span>{getAlbumReleaseYear(albumData.release_date)}</span>
                </Tooltip>
                &nbsp;•&nbsp;
                <span>{albumData.tracks.items.length} songs,</span>
                <span className={styles.albumDuration}>
                  &nbsp;
                  {msToTimeFormatted(
                    albumData.tracks.items.reduce(
                      (acc, track) => acc + track.duration_ms,
                      0
                    )
                  )}
                </span>
              </>
            }
          />
        )}
        {albumData && <AlbumPlaylistActions data={albumData} />}
        {albumData?.tracks?.items.length && (
          <Tracks data={albumData.tracks.items} album={albumData} hideAlbum />
        )}
      </main>
    </>
  );
}
