'use client';
import { useContext, useState } from 'react';
import { ArtistType, TrackType } from '@/services/spotify';
import { PlayerContext } from '@/context/player.context';
import { getPlayerId } from '@/helpers';
import PlayButton from '@/components/PlayButton';
import Tracks from '@/components/Tracks';
import styles from './TopTracks.module.scss';

interface Props {
  artist: ArtistType;
  tracks: TrackType[];
}

export default function TopTracks(props: Props) {
  const { artist, tracks } = props;

  const { player, isPlaying, startPlayer } = useContext(PlayerContext);
  const [seeMore, setSeeMore] = useState(false);

  return (
    <>
      <div className={styles.actions}>
        <PlayButton
          className={styles.playButton}
          onClick={() => startPlayer({ argumentType: 'data', data: artist, tracks })}
          isButtonPlaying={getPlayerId(artist) === player?.id && isPlaying}
        />
      </div>

      <div>
        <div className={styles.rowHeader}>
          <h2>Popular</h2>
        </div>
        <Tracks
          playerId={getPlayerId(artist)}
          data={seeMore ? tracks : tracks.slice(0, 5)}
          hideHeaderLabels
        />
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
