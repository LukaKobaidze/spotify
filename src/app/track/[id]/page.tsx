'use client';
import { Fragment, useContext, useEffect, useState } from 'react';
import styles from './page.module.scss';
import { SpotifyAccessContext } from '@/context/spotifyAccess.context';
import Header from '@/components/Header/Header';
import { AlbumType, ArtistType, LyricsType, TrackType } from '@/types';
import {
  fetchAlbum,
  fetchArtist,
  fetchLyrics,
  fetchTrack,
} from '@/helpers/requests';
import ItemHeader from '@/components/PlayerHeader/PlayerHeader';
import { getAlbumReleaseYear, msToTime } from '@/helpers/time';
import Tooltip from '@/components/Tooltip/Tooltip';
import PlayButton from '@/components/PlayButton/PlayButton';
import LikeButton from '@/components/LikeButton/LikeButton';
import { LibraryContext } from '@/context/library.context';
import Link from 'next/link';
import Image from 'next/image';
import Songs from '@/components/Songs/Songs';
import { PlayerContext } from '@/context/player.context';

interface Props {
  params: {
    id: string;
  };
}

export default function TrackPage({ params }: Props) {
  const { token } = useContext(SpotifyAccessContext);
  const { liked, onSaveToLiked } = useContext(LibraryContext);
  const { playTrack } = useContext(PlayerContext);
  const [trackData, setTrackData] = useState<TrackType>();
  const [artistData, setArtistData] = useState<ArtistType>();
  const [albumData, setAlbumData] = useState<AlbumType>();
  const [lyrics, setLyrics] = useState<LyricsType>();

  useEffect(() => {
    fetchTrack(token, params.id).then((data) => {
      setTrackData(data);

      fetchArtist(token, data.artists[0].id).then((data) => setArtistData(data));
      fetchAlbum(token, data.album.id).then((data) => setAlbumData(data));
    });
  }, [token, params.id]);

  useEffect(() => {
    fetchLyrics(params.id).then((data) => {
      setLyrics(data);
    });
  }, [params.id]);

  return (
    <>
      <Header />
      <main>
        {trackData && artistData && (
          <>
            <ItemHeader
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
            <div className={styles.actions}>
              <PlayButton variant="large" onClick={() => playTrack(trackData)} />
              <LikeButton
                active={liked.includes(trackData.id)}
                variant="large"
                onClick={() => onSaveToLiked(trackData.id)}
              />
            </div>
          </>
        )}

        {lyrics && (
          <div className={styles.lyrics}>
            <h2 className={styles.lyricsHeading}>Lyrics</h2>
            <div>
              {!lyrics.error ? (
                lyrics.lines.map((line) =>
                  !line.words ? (
                    <Fragment key={line.timeTag} />
                  ) : (
                    <p key={line.timeTag} className={styles.lyricsParagraph}>
                      {line.words}
                    </p>
                  )
                )
              ) : (
                <p>Unavailable...</p>
              )}
            </div>
          </div>
        )}

        {albumData && (
          <div className={styles.albumWrapper}>
            <Link href={`/album/${albumData.id}`} className={styles.album}>
              <Image
                src={albumData.images[1].url}
                width={albumData.images[1].width}
                height={albumData.images[1].height}
                alt=""
                className={styles.albumImage}
              />
              <div>
                <p className={styles.albumText}>From the album</p>
                <h3 className={styles.albumName}>{albumData.name}</h3>
              </div>
            </Link>
            <Songs
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
