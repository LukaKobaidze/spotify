'use client';
import PlayButton from '@/components/PlayButton';
import Tracks from '@/components/Tracks';
import styles from './TopTracks.module.scss';
import { TrackType } from '@/types';
import { useState } from 'react';

interface Props {
  data: TrackType[];
}

export default function TopTracks(props: Props) {
  const { data } = props;

  const [seeMore, setSeeMore] = useState(false);

  return (
    <>
      <div className={styles.actions}>
        <PlayButton className={styles.playButton} />
      </div>

      <div>
        <div className={styles.rowHeader}>
          <h2>Popular</h2>
        </div>
        <Tracks data={seeMore ? data : data.slice(0, 5)} hideHeaderLabels />
        <button
          className={styles.popularSongsSeeMoreButton}
          onClick={() => setSeeMore((state) => !state)}
        >
          {seeMore ? 'Show less' : 'See more'}
        </button>
      </div>
    </>
  );
}
