import Link from 'next/link';
import { cookies } from 'next/headers';
import { fetchAlbum, fetchArtist, fetchTrack } from '@/services/spotify';
import { fetchLyrics } from '@/services/genius';
import { getAlbumReleaseYear, msToTime } from '@/helpers';
import { getPlayerId } from '@/helpers';
import Header from '@/components/Header';
import PlayerHeader from '@/components/PlayerHeader';
import Tracks from '@/components/Tracks';
import Tooltip from '@/components/Tooltip';
import TrackListHeader from '@/components/TrackListHeader';
import AlbumPlaylistTrackActions from '@/components/AlbumPlaylistTrackActions';
import styles from './page.module.scss';

interface Props {
  params: {
    id: string;
  };
}

export default async function TrackPage({ params }: Props) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  const trackData = accessToken ? await fetchTrack(accessToken, params.id) : null;
  const artistData = trackData
    ? await fetchArtist(accessToken!, trackData.artists[0].id)
    : null;
  const albumData = trackData
    ? await fetchAlbum(accessToken!, trackData.album.id)
    : null;
  const lyrics = trackData
    ? await fetchLyrics(trackData.name, trackData.artists[0].name)
    : null;

  return (
    <>
      <Header backgroundOpacity={0.5} />
      <main>
        {trackData && artistData && (
          <>
            <PlayerHeader
              artist={artistData}
              image={trackData.album.images[1]}
              type="Song"
              title={trackData.name}
              subtitle={
                <>
                  &nbsp;•&nbsp;
                  <Link
                    href={'/album/' + trackData.album.id}
                    className="linkHoverUnderline"
                  >
                    {trackData.album.name}
                  </Link>
                  &nbsp;•&nbsp;
                  <Tooltip
                    text={new Date(trackData.album.release_date).toLocaleDateString(
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
                    <span>{getAlbumReleaseYear(trackData.album.release_date)}</span>
                  </Tooltip>
                  &nbsp;•&nbsp;
                  <span>{msToTime(trackData.duration_ms)}</span>
                </>
              }
            />
            {albumData && (
              <AlbumPlaylistTrackActions data={trackData} trackList={[trackData]} />
            )}
          </>
        )}

        <div className={styles.lyrics}>
          <h2>Lyrics</h2>
          <div>
            {lyrics ? (
              lyrics.split('\n').map((line, i) => (
                <>
                  {line[0] === '[' && <br />}
                  <p key={i} className={styles.lyricsParagraph}>
                    {line}
                  </p>
                </>
              ))
            ) : (
              <p>Unavailable...</p>
            )}
          </div>
        </div>

        {albumData && (
          <div className={styles.albumWrapper}>
            <TrackListHeader data={albumData} />
            <Tracks
              playerId={getPlayerId(albumData)}
              data={albumData.tracks.items}
              album={albumData}
              hideHeaderLabels
              hideAlbum
            />
          </div>
        )}
      </main>
    </>
  );
}
