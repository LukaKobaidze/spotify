'use client';
import Link from 'next/link';
import { useState, useContext, useRef, useEffect } from 'react';
import { msToTime } from '@/helpers';
import {
  IconAdd,
  IconAlbum,
  IconDuration,
  IconMore,
  IconPause,
  IconPlay,
  IconRemove,
  IconUser,
} from '@/icons';
import { Optional } from '@/types';
import { LayoutContext } from '@/context/layout.context';
import { MenuContext } from '@/context/menu.context';
import { PlayerContext } from '@/context/player.context';
import { LibraryContext } from '@/context/library.context';
import { AlbumType, TrackType } from '@/services/spotify';
import Tooltip from '@/components/Tooltip';
import TrackTitle from '@/components/TrackTitle';
import LikeButton from '@/components/LikeButton';
import AlertOutsideClick from '@/components/AlertOutsideClick';
import styles from './Tracks.module.scss';

type Props = {
  playerId: string;
  data: Optional<TrackType, 'album'>[];
  album?: AlbumType;
  hideHeaderLabels?: boolean;
  hideIndexing?: boolean;
  hideAlbum?: boolean;
  hideAlbumColumn?: boolean;
  bodyGap?: number;
  className?: string;
};

export default function Tracks(props: Props) {
  const {
    playerId,
    data,
    album,
    hideHeaderLabels,
    hideIndexing,
    hideAlbum,
    hideAlbumColumn,
    bodyGap = 16,
    className,
  } = props;

  const { player, isPlaying, startPlayer, updateTrackList } =
    useContext(PlayerContext);
  const { liked, onSaveToLiked } = useContext(LibraryContext);
  const { renderMenu } = useContext(MenuContext);
  const { mainViewSize } = useContext(LayoutContext);
  const [containerWidth, setContainerWidth] = useState(0);
  const [trackActive, setTrackActive] = useState<number | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const handleRenderTrackMenu = (
    track: Optional<TrackType, 'album'>,
    windowPos: { x: number; y: number }
  ) => {
    const trackAlbum = track.album || album!;

    return renderMenu({
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

      windowPos,
    });
  };

  const handleTrackRightClick = (
    e: React.MouseEvent<HTMLElement>,
    track: Optional<TrackType, 'album'>
  ) => {
    e.preventDefault();

    handleRenderTrackMenu(track, { x: e.pageX, y: e.pageY });
  };

  const tbodyStyle = { '--tbody-gap': bodyGap + 'px' } as React.CSSProperties;

  useEffect(() => {
    if (tableRef.current) {
      setContainerWidth(tableRef.current.clientWidth);
    }
  }, [mainViewSize]);

  useEffect(() => {
    if (playerId === player?.id) {
      updateTrackList(data);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length, updateTrackList]);

  const renderHideAlbumColumn = hideAlbumColumn || containerWidth < 600;

  return (
    <table ref={tableRef} className={`${styles.tableContainer} ${className || ''}`}>
      <thead className={hideHeaderLabels ? styles['thead-hide'] : ''}>
        <tr className={styles.header}>
          {!hideIndexing && (
            <th className={styles.index}>
              <span className={styles.indexSpan}>#</span>
            </th>
          )}
          <th>Title</th>
          {!hideAlbum && !renderHideAlbumColumn && <th>Album</th>}
          <th>
            <Tooltip text="Duration" position="top">
              <div className={styles.thDurationWrapper}>
                <IconDuration />
              </div>
            </Tooltip>
          </th>
        </tr>
      </thead>

      <AlertOutsideClick event="click" onOutsideClick={() => setTrackActive(null)}>
        <tbody className={styles.tbody} style={tbodyStyle}>
          {data?.map((mapTrack, trackIndex: number) => {
            if (!mapTrack) return null;

            const image = mapTrack?.album?.images[mapTrack.album.images.length - 1];
            const trackIsPlaying =
              player &&
              isPlaying &&
              playerId === player.id &&
              mapTrack.id === player.list[player.currentlyPlaying]?.id;
            console.log(mapTrack);
            const currentAlbum = album || mapTrack.album!;
            const isDisabled = !mapTrack.preview_url;

            const handlePlayTrack = () => {
              if (!isDisabled) {
                startPlayer({
                  argumentType: 'id',
                  id: playerId,
                  tracks: data,
                  trackIndex,
                  album: !mapTrack.album ? album : undefined,
                });
              }
            };
            return (
              <tr
                key={mapTrack.id}
                className={`${styles.songRow} ${
                  trackIsPlaying ? styles.isPlaying : ''
                } ${isDisabled ? styles.disabled : ''} ${
                  trackIndex === trackActive ? styles.active : ''
                }`}
                onContextMenu={(e) => handleTrackRightClick(e, mapTrack)}
                onClick={(e) => {
                  setTrackActive(trackIndex);

                  if (window.matchMedia('(pointer: coarse)').matches) {
                    handlePlayTrack();
                  }
                }}
              >
                {!hideIndexing && (
                  <td className={styles.index}>
                    <button className={styles.player} onClick={handlePlayTrack}>
                      {trackIsPlaying ? <IconPause /> : <IconPlay />}
                    </button>
                    <span className={styles.indexSpan}>{trackIndex + 1} </span>
                  </td>
                )}
                <td className={styles.tdTitle}>
                  {hideIndexing && (
                    <div className={styles.playerOnImageWrapper}>
                      <button className={styles.player} onClick={handlePlayTrack}>
                        {trackIsPlaying ? <IconPause /> : <IconPlay />}
                      </button>
                    </div>
                  )}
                  {hideAlbum || !image ? (
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
                      image={{ src: image.url, size: 40 }}
                    />
                  )}
                </td>
                {!hideAlbum && !renderHideAlbumColumn && (
                  <td className={styles.tdAlbum}>
                    <div className={styles.tdAlbumWrapper}>
                      <Link
                        className={styles.tdAlbumAnchor}
                        href={'/album/' + currentAlbum.id}
                      >
                        {currentAlbum.name}
                      </Link>
                    </div>
                  </td>
                )}
                <td className={styles.tdDuration}>
                  <LikeButton
                    active={liked.includes(mapTrack.id)}
                    onClick={() => onSaveToLiked(mapTrack.id)}
                    className={`${styles.likeButton} ${
                      containerWidth < 500 ? styles['likeButton--breakpoint-1'] : ''
                    }`}
                  />
                  <div>{msToTime(mapTrack.duration_ms)}</div>
                  <button
                    className={styles.moreButton}
                    onClick={(e) => {
                      const element = e.target as HTMLButtonElement;
                      const rect = element.getBoundingClientRect();

                      handleRenderTrackMenu(mapTrack, {
                        x: rect.left + document.documentElement.scrollLeft,
                        y: rect.top + document.documentElement.scrollTop,
                      });
                    }}
                  >
                    <IconMore />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </AlertOutsideClick>
    </table>
  );
}
