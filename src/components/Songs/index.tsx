import { useContext } from 'react';
import Image from 'next/image';
import { msToTime } from '@/helpers/time';
import { IconDuration, IconPause, IconPlay } from '@/icons';
import Tooltip from '../Tooltip';
import styles from './Songs.module.scss';
import { PlayerContext } from '@/context/player.context';
import TrackTitle from '../TrackTitle';
import Link from 'next/link';
import { AlbumType, PartialBy, TrackType } from '@/types';
import { LibraryContext } from '@/context/library.context';
import LikeButton from '../LikeButton';

type Props = {
  data: PartialBy<TrackType, 'album'>[];
  album?: AlbumType;
  hideHeaderLabels?: boolean;
  hideIndexing?: boolean;
  hideAlbum?: boolean;
  hideAlbumColumn?: boolean;
  disableBodyGap?: boolean;
};

export default function Songs(props: Props) {
  const {
    data,
    album,
    hideHeaderLabels,
    hideIndexing,
    hideAlbum,
    hideAlbumColumn,
    disableBodyGap,
  } = props;
  const { track, isPlaying, playTrack } = useContext(PlayerContext);
  const { liked, onSaveToLiked } = useContext(LibraryContext);

  return (
    <table className={styles.tableContainer}>
      <thead>
        <tr
          className={styles.header}
          style={hideHeaderLabels ? { display: 'none' } : undefined}
        >
          {!hideIndexing && (
            <th className={styles.index}>
              <span className={styles.indexSpan}>#</span>
            </th>
          )}
          <th>Title</th>
          {!hideAlbum && !hideAlbumColumn && <th>Album</th>}
          <th>
            <Tooltip
              text="Duration"
              position="top"
              showOnHover
              className={styles.thDurationWrapper}
            >
              <IconDuration />
            </Tooltip>
          </th>
        </tr>
      </thead>

      <tbody className={`${!disableBodyGap ? styles.tbodygap : ''}`}>
        {data?.map((mapTrack, i: number) => {
          const image = mapTrack?.album?.images[mapTrack.album.images.length - 1];
          const songIsPlaying = mapTrack.id === track?.id && isPlaying;
          const currentAlbum = album || mapTrack.album!;

          return (
            <tr
              key={mapTrack.id}
              className={`${styles.songRow} ${
                songIsPlaying ? styles.isPlaying : ''
              }`}
            >
              {!hideIndexing && (
                <td className={styles.index}>
                  <button
                    className={styles.player}
                    onClick={() => {
                      playTrack({
                        ...mapTrack,
                        album: currentAlbum,
                      });
                    }}
                  >
                    {songIsPlaying ? <IconPause /> : <IconPlay />}
                  </button>
                  <span className={styles.indexSpan}>{i + 1} </span>
                </td>
              )}
              <td className={styles.tdTitle}>
                {hideIndexing && (
                  <div className={styles.playerOnImageWrapper}>
                    <button
                      className={styles.player}
                      onClick={() => {
                        playTrack({ ...mapTrack, album: currentAlbum });
                      }}
                    >
                      {songIsPlaying ? <IconPause /> : <IconPlay />}
                    </button>
                  </div>
                )}
                {hideAlbum ? (
                  <TrackTitle
                    trackName={mapTrack.name}
                    trackId={mapTrack.id}
                    artistName={mapTrack.artists[0].name}
                    artistId={mapTrack.artists[0].id}
                  />
                ) : (
                  <TrackTitle
                    trackName={mapTrack.name}
                    trackId={mapTrack.id}
                    artistName={mapTrack.artists[0].name}
                    artistId={mapTrack.artists[0].id}
                    image={image?.url}
                    imageSize={image?.height}
                  />
                )}
              </td>
              {(!hideAlbum && !hideAlbumColumn) && (
                <td className={styles.tdAlbum}>
                  <Link
                    className={styles.tdAlbumAnchor}
                    href={'/album/' + currentAlbum.id}
                  >
                    {currentAlbum.name}
                  </Link>
                </td>
              )}
              <td className={styles.tdDuration}>
                <LikeButton
                  active={liked.includes(mapTrack.id)}
                  onClick={() => onSaveToLiked(mapTrack.id)}
                  classNameContainer={styles.likeButtonContainer}
                />
                <div>{msToTime(mapTrack.duration_ms)}</div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
