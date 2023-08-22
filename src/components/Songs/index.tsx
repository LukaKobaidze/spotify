import { useEffect, useContext, useState } from 'react';
import Image from 'next/image';
import { msToTime } from '@/helpers/time';
import { IconDuration, IconHeart, IconPause, IconPlay } from '@/icons';
import Tooltip from '../Tooltip';
import styles from './Songs.module.scss';
import { PlayerContext } from '@/context/player.context';
import TrackTitle from '../TrackTitle';

interface Props {
  data: any[];
  hideHeaderLabels?: boolean;
  hideIndexing?: boolean;
}

export default function Songs(props: Props) {
  const { data, hideHeaderLabels, hideIndexing } = props;
  const { track, isPlaying, playTrack } = useContext(PlayerContext);

  return (
    <table className={styles.tableContainer}>
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
        <th>Album</th>
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

      {data?.map((mapTrack: any, i: number) => {
        const image = mapTrack.album.images[2];
        const songIsPlaying = mapTrack.id === track?.id && isPlaying;

        return (
          <tr
            key={mapTrack.id}
            className={`${styles.songRow} ${songIsPlaying ? styles.isPlaying : ''}`}
          >
            {!hideIndexing && (
              <td className={styles.index}>
                <button
                  className={styles.player}
                  onClick={() => {
                    playTrack(mapTrack);
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
                      playTrack(mapTrack);
                    }}
                  >
                    {songIsPlaying ? <IconPause /> : <IconPlay />}
                  </button>
                </div>
              )}
              <TrackTitle
                trackName={mapTrack.name}
                artistName={mapTrack.artists[0].name}
                image={image.url}
                imageSize={image.height}
              />
            </td>
            <td className={styles.tdAlbum}>{mapTrack.album.name}</td>
            <td className={styles.tdDuration}>
              <Tooltip
                text="Save to Your Library"
                position="top"
                showOnHover
                offset={0}
                className={styles.buttonLikeWrapper}
              >
                <button className={styles.buttonLike}>
                  <IconHeart />
                </button>
              </Tooltip>
              <div>{msToTime(mapTrack.duration_ms)}</div>
            </td>
          </tr>
        );
      })}
    </table>
  );
}
