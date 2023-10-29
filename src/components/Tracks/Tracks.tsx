'use client';
import { useContext } from 'react';
import { msToTime } from '@/helpers/time';
import {
  IconAdd,
  IconAlbum,
  IconDuration,
  IconPause,
  IconPlay,
  IconRemove,
  IconUser,
} from '@/icons';
import Tooltip from '../Tooltip/Tooltip';
import styles from './Tracks.module.scss';
import { PlayerContext } from '@/context/player.context';
import TrackTitle from '../TrackTitle/TrackTitle';
import Link from 'next/link';
import { Optional } from '@/types';
import { LibraryContext } from '@/context/library.context';
import LikeButton from '../LikeButton/LikeButton';
import { AlbumType, TrackType } from '@/services/spotify';
import { MenuContext } from '@/context/menu.context';

type Props = {
  data: Optional<TrackType, 'album'>[];
  album?: AlbumType;
  hideHeaderLabels?: boolean;
  hideIndexing?: boolean;
  hideAlbum?: boolean;
  hideAlbumColumn?: boolean;
  bodyGap?: number;
};

export default function Tracks(props: Props) {
  const {
    data,
    album,
    hideHeaderLabels,
    hideIndexing,
    hideAlbum,
    hideAlbumColumn,
    bodyGap = 16,
  } = props;
  const { track, isPlaying, playTrack } = useContext(PlayerContext);
  const { liked, onSaveToLiked } = useContext(LibraryContext);
  const { renderMenu } = useContext(MenuContext);

  const handleTrackRightClick = (
    e: React.MouseEvent<HTMLElement>,
    track: Optional<TrackType, 'album'>
  ) => {
    e.preventDefault();

    const trackAlbum = track.album || album!;
    renderMenu({
      items: [
        {
          type: 'button',
          name: liked.includes(track.id)
            ? { Icon: IconRemove, text: 'Remove from your Liked Songs' }
            : { Icon: IconAdd, text: 'Save to your Liked Songs' },
          action: () => {
            onSaveToLiked(track.id);
          },
        },
        {
          type: 'link',
          href: `/album/${trackAlbum.id}`,
          name: { text: 'Go to album', Icon: IconAlbum },
        },
        {
          type: 'link',
          href: `/artist/${track.artists[0].id}`,
          name: { text: 'Go to artist', Icon: IconUser },
        },
      ],
      windowPos: { x: e.pageX, y: e.pageY },
    });
  };

  const tbodyStyle = { '--tbody-gap': bodyGap + 'px' } as React.CSSProperties;
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

      <tbody className={styles.tbody} style={tbodyStyle}>
        {data?.map((mapTrack, i: number) => {
          const image = mapTrack?.album?.images[mapTrack.album.images.length - 1];
          const trackIsPlaying = mapTrack.id === track?.id && isPlaying;
          const currentAlbum = album || mapTrack.album!;

          return (
            <tr
              key={mapTrack.id}
              className={`${styles.songRow} ${
                trackIsPlaying ? styles.isPlaying : ''
              }`}
              onContextMenu={(e) => handleTrackRightClick(e, mapTrack)}
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
                    {trackIsPlaying ? <IconPause /> : <IconPlay />}
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
                      {trackIsPlaying ? <IconPause /> : <IconPlay />}
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
              {!hideAlbum && !hideAlbumColumn && (
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
