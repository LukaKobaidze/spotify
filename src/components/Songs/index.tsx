import { useEffect, useContext } from 'react';
import Image from 'next/image';
import { msToTime } from '@/helpers/time';
import { IconDuration, IconHeart, IconPlay } from '@/icons';
import Tooltip from '../Tooltip';
import styles from './Songs.module.scss';
import { PlayerContext } from '@/context/player.context';

interface Props {
  data: any[];
}

export default function Songs(props: Props) {
  const { data } = props;
  const { playTrack } = useContext(PlayerContext);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <table className={styles.tableContainer}>
      <tr className={styles.header}>
        <th className={styles.index}>
          <span className={styles.indexSpan}>#</span>
        </th>
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

      {data?.map((track: any, i: number) => {
        const image = track.album.images[track.album.images.length - 1];

        return (
          <tr key={track.id} className={styles.songRow}>
            <td className={styles.index}>
              <span className={styles.indexSpan}>{i + 1} </span>
              <button className={styles.player} onClick={playTrack}>
                <IconPlay />
              </button>
            </td>
            <td className={styles.tdTitle}>
              <Image
                alt=""
                src={image.url}
                width={image.height}
                height={image.height}
                className={styles.tdTitleImage}
              />
              <div>
                <div className={styles.tdTitleText}>
                  <span className={styles.tdTitleTextTrack}>{track.name}</span>
                  <span className={styles.tdTitleTextArtist}>
                    {track.artists[0].name}
                  </span>
                </div>
              </div>
            </td>
            <td>{track.album.name}</td>
            <td className={styles.tdDuration}>
              <Tooltip
                text="Save to Your Library"
                position="top"
                showOnHover
                className={styles.buttonLikeWrapper}
              >
                <button className={styles.buttonLike}>
                  <IconHeart />
                </button>
              </Tooltip>
              <div>{msToTime(track.duration_ms)}</div>
            </td>
          </tr>
        );
      })}
    </table>
  );
}
