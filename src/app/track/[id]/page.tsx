import { cookies } from 'next/headers';
import { fetchAlbum, fetchArtist, fetchTrack } from '@/services/spotify';
import { fetchLyrics } from '@/services/genius';
import { getAlbumReleaseYear, msToTime } from '@/helpers/time';
import Header from '@/components/Header';
import PlayerHeader from '@/components/PlayerHeader';
import Tracks from '@/components/Tracks';
import Tooltip from '@/components/Tooltip';
import Actions from './Actions';
import styles from './page.module.scss';
import TrackListHeader from '@/components/TrackListHeader';

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
      <Header />
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
                  <span>{trackData.album.name}</span>
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
                    showOnHover
                  >
                    <span>{getAlbumReleaseYear(trackData.album.release_date)}</span>
                  </Tooltip>
                  &nbsp;•&nbsp;
                  <span>{msToTime(trackData.duration_ms)}</span>
                </>
              }
              className={styles.itemHeader}
              classNameImage={styles.itemHeaderImage}
            />
            <Actions trackData={trackData} />
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
