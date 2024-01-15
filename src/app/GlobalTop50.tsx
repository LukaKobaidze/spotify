'use client';
import Link from 'next/link';
import { useMemo } from 'react';
import { PlaylistType } from '@/services/spotify';
import { getPlayerId } from '@/helpers/player';
import TrackListHeader from '@/components/TrackListHeader';
import Tracks from '@/components/Tracks';
import styles from './GlobalTop50.module.scss';

interface Props {
  data: PlaylistType;
  className?: string;
}

export default function GlobalTop50({ data, className }: Props) {
  const tracksData = useMemo(
    () => data?.tracks?.items.map((track) => track.track).slice(0, 10),
    [data]
  );

  return (
    <div className={className || ''}>
      <TrackListHeader data={data} />
      <Tracks
        playerId={getPlayerId(data)}
        data={tracksData}
        bodyGap={5}
        hideHeaderLabels
      />
      <Link href={'/playlist/' + data.id} className={styles.seeMore}>
        See More
      </Link>
    </div>
  );
}
